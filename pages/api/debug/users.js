import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ message: 'Not found' })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })
    res.status(200).json({ users })
  } catch (error) {
    console.error('Debug error:', error)
    res.status(500).json({ message: 'Server error' })
  }
} 