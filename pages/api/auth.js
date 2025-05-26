import {
  createUser,
  findUserByEmail,
  verifyPassword,
  setAuthCookie,
  clearAuthCookie,
} from '../../lib/auth'
import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name, mode } = req.body
    console.log('Auth request:', { mode, email, name }) // Debug log

    // Only check for required fields if not logging out
    if (mode !== 'logout' && (!email || !password)) {
      console.log('Missing fields:', { email: !!email, password: !!password }) // Debug log
      return res.status(400).json({ message: 'Email and password are required' })
    }

    try {
      if (mode === 'register') {
        const existingUser = await findUserByEmail(email)
        if (existingUser) {
          console.log('User already exists:', email) // Debug log
          return res.status(400).json({ message: 'User already exists' })
        }

        // Create user with CUSTOMER role by default
        const user = await createUser(email, password, name, 'CUSTOMER')
        console.log('User created:', { id: user.id, email: user.email }) // Debug log
        await setAuthCookie(res, user)

        return res.status(201).json({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        })
      }

      if (mode === 'login') {
        console.log('Login attempt for:', email) // Debug log
        const user = await findUserByEmail(email)
        if (!user) {
          console.log('User not found:', email) // Debug log
          return res.status(401).json({ message: 'Email or password is incorrect' })
        }

        console.log('Verifying password for:', email) // Debug log
        const isValid = await verifyPassword(password, user.password)
        if (!isValid) {
          console.log('Invalid password for:', email) // Debug log
          return res.status(401).json({ message: 'Email or password is incorrect' })
        }

        try {
          console.log('Setting auth cookie for:', email) // Debug log
          await setAuthCookie(res, user)
        } catch (cookieError) {
          console.error('Failed to set auth cookie:', cookieError)
          return res.status(500).json({ message: 'Failed to create session' })
        }

        console.log('Login successful:', { id: user.id, email: user.email }) // Debug log
        return res.status(200).json({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        })
      }

      if (mode === 'logout') {
        await clearAuthCookie(res)
        return res.status(200).json({ message: 'Logged out successfully' })
      }

      return res.status(400).json({ message: 'Invalid mode' })
    } catch (error) {
      console.error('Auth error:', error)
      return res.status(500).json({ 
        message: 'An error occurred during authentication',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
