// pages/api/order.js
import { prisma } from './prisma'

export async function createOrder(items, userId, address, phone) {
  if (!items || !Array.isArray(items)) {
    throw new Error('Invalid items')
  }

  const total = items.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        address,
        phone,
        items: {
          create: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price
          })),
        },
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      },
    })

    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            menuItem: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders: ' + error.message);
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            menuItem: true
          }
        }
      }
    })
    return order
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

export async function deleteOrder(orderId) {
  try {
    // First delete all related OrderItems
    await prisma.orderItem.deleteMany({
      where: { orderId }
    })

    // Then delete the Order
    await prisma.order.delete({
      where: { id: orderId }
    })
  } catch (error) {
    console.error('Error deleting order:', error)
    throw error
  }
}
