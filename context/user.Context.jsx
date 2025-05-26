import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/me', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, mode: 'login' }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Login failed')
      }

      await fetchUser() // Refresh user data after login
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.message || 'An error occurred during login'
      }
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mode: 'logout' }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Logout failed')
      }

      setUser(null)
      router.push('/')
      return { success: true }
    } catch (error) {
      console.error('Logout failed:', error)
      return { 
        success: false, 
        error: error.message || 'An error occurred during logout'
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading, login, logout, fetchUser }}>
      {children}
    </UserContext.Provider>
  )
}

// Make sure this export exists
export const useUser = () => useContext(UserContext)