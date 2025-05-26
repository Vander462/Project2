import { hash, compare } from 'bcryptjs'
import prisma from './prisma'
import { serialize } from 'cookie'
import { parseCookies } from 'nookies'
import { useEffect, useState } from 'react'

const SALT_ROUNDS = 12

export async function hashPassword(password) {
  return await hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password, hashedPassword) {
  return await compare(password, hashedPassword)
}

export async function createUser(email, password, name, role = 'CUSTOMER') {
  const hashedPassword = await hashPassword(password)
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role
    }
  })
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email }
  })
}

export async function setAuthCookie(res, user) {
  const cookie = serialize('auth', JSON.stringify({ id: user.id, email: user.email, role: user.role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}

export async function clearAuthCookie(res) {
  const cookie = serialize('auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
}

export async function getAuthUser(req) {
  const cookies = parseCookies({ req })
  if (!cookies.auth) return null

  try {
    const authData = JSON.parse(cookies.auth)
    return await prisma.user.findUnique({
      where: { id: authData.id },
      select: { id: true, email: true, name: true, role: true }
    })
  } catch (error) {
    return null
  }
}

export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading }
}
