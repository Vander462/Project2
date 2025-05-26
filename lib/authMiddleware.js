import { getAuthUser } from './auth'

export async function authMiddleware(req, res) {
  const user = await getAuthUser(req)
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' })
    return false
  }
  return user
}