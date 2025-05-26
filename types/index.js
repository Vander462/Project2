// This file contains reference structures for developers using plain JavaScript.
// No type enforcement is done here. Use this for documentation or mock data creation only.

// Example User object
const exampleUser = {
  id: 1,
  email: 'user@example.com',
  name: 'John Doe',
  role: 'CUSTOMER', // 'ADMIN' or 'CUSTOMER'
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Example MenuItem
const exampleMenuItem = {
  id: 1,
  name: 'Pizza Margherita',
  description: 'Classic cheese and tomato pizza',
  price: 12.99,
  category: 'Pizza',
  image: '/images/pizza.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Example CartItem
const exampleCartItem = {
  id: 1,
  userId: 1,
  menuItemId: 1,
  quantity: 2,
  menuItem: exampleMenuItem,
}

// Order status options
const OrderStatus = {
  PENDING: 'PENDING',
  PREPARING: 'PREPARING',
  DELIVERING: 'DELIVERING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
}

// Example OrderItem
const exampleOrderItem = {
  id: 1,
  orderId: 1,
  menuItemId: 1,
  quantity: 2,
  price: 12.99,
  menuItem: exampleMenuItem,
}

// Example Order
const exampleOrder = {
  id: 1,
  userId: 1,
  total: 25.98,
  status: OrderStatus.PENDING,
  address: '123 Main St',
  phone: '123-456-7890',
  createdAt: new Date(),
  updatedAt: new Date(),
  items: [exampleOrderItem],
  user: {
    id: 1,
    email: 'user@example.com',
    name: 'John Doe',
  },
}

// Example API Response
const exampleApiResponse = {
  success: true,
  data: {}, // Can hold any response data
  error: null,
  message: 'Request successful',
}

// Auth Payload
const exampleAuthPayload = {
  id: 1,
  email: 'admin@example.com',
  role: 'ADMIN',
}

// Login and Register Form Data
const exampleLoginFormData = {
  email: 'user@example.com',
  password: 'password123',
}

const exampleRegisterFormData = {
  ...exampleLoginFormData,
  name: 'Jane Smith',
}

// Component Props (for documentation/reference only)
const exampleLayoutProps = {
  children: null,
  title: 'Page Title',
}

const exampleProtectedRouteProps = {
  children: null,
  requiredRole: 'CUSTOMER',
}

export {
  exampleUser,
  exampleMenuItem,
  exampleCartItem,
  OrderStatus,
  exampleOrderItem,
  exampleOrder,
  exampleApiResponse,
  exampleAuthPayload,
  exampleLoginFormData,
  exampleRegisterFormData,
  exampleLayoutProps,
  exampleProtectedRouteProps,
}
