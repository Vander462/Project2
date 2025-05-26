import { getAuthUser } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const user = await getAuthUser(req)
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' })
    }
    res.status(200).json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}