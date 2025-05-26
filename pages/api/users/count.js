import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const count = await prisma.user.count()
    res.status(200).json({ count })
  } catch (error) {
    console.error('Error counting users:', error)
    res.status(500).json({ message: 'Server error' })
  }
} 