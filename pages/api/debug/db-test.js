import prisma from '../../../lib/prisma'

export default async function handler(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ message: 'Not found' })
  }

  try {
    // Test database connection
    await prisma.$connect()
    console.log('Database connection successful')

    // Test user count
    const userCount = await prisma.user.count()
    console.log('Total users:', userCount)

    res.status(200).json({ 
      status: 'Database connection successful',
      userCount
    })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message
    })
  } finally {
    await prisma.$disconnect()
  }
} 