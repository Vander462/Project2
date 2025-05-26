import { getAuthUser } from '../../lib/auth'

export default async function handler(req, res) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return res.status(401).json({ user: null })
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error('Failed to get auth user:', error)
    res.status(500).json({ message: 'Server error', user: null })
  }
}
