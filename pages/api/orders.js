import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from '../../lib/order'
import { getAuthUser } from '../../lib/auth'

export default async function handler(req, res) {
  let user = null

  try {
    user = await getAuthUser(req)

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    switch (req.method) {
      case 'GET':
        if (user.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Forbidden' })
        }
        const orders = await getAllOrders()
        return res.status(200).json(orders)

      case 'POST':
        const { items, address, phone } = req.body
        const order = await createOrder(items, user.id, address, phone)
        return res.status(200).json(order)

      case 'PUT':
        if (user.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Forbidden' })
        }
        const { orderId, status } = req.body
        const updatedOrder = await updateOrderStatus(orderId, status)
        return res.status(200).json(updatedOrder)

      case 'DELETE':
        if (user.role !== 'ADMIN') {
          return res.status(403).json({ error: 'Forbidden' })
        }
        const { id } = req.query
        await deleteOrder(id)
        return res.status(200).json({ message: 'Order deleted successfully' })

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      user,
      method: req.method,
    })
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
