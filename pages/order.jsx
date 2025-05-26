import { useEffect, useState } from 'react'
import { useUser } from '../lib/auth'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Footer from '@/components/Footer'
import styles from '@/styles/Order.module.css'

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState([])
  const [menuLoading, setMenuLoading] = useState(true)
  const [quantities, setQuantities] = useState({})
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [orderData, setOrderData] = useState({
    address: '',
    phone: ''
  })
  const { user, loading: userLoading } = useUser()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu', {
          credentials: 'include'
        })
        const data = await res.json()

        if (!Array.isArray(data)) throw new Error('Invalid menu data')

        setMenuItems(data)
        const initialQuantities = data.reduce((acc, item) => {
          acc[item.id] = 0
          return acc
        }, {})
        setQuantities(initialQuantities)
      } catch (error) {
        console.error('Failed to fetch menu:', error)
        setOrderError('Failed to load menu items')
      } finally {
        setMenuLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const handleQuantityChange = (itemId, value) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, value)
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }))
    setOrderError('')
  }

  const placeOrder = async () => {
    try {
      setOrderError('')
      
      if (!user) {
        router.push('/auth')
        return
      }

      if (!orderData.address || !orderData.phone) {
        setOrderError('Please fill in both delivery address and phone number')
        return
      }

      const itemsToOrder = menuItems
        .filter(item => quantities[item.id] > 0)
        .map(item => ({
          menuItemId: item.id,
          quantity: quantities[item.id],
          price: item.price
        }))

      if (itemsToOrder.length === 0) {
        setOrderError('Please select at least one item to order')
        return
      }

      const total = itemsToOrder.reduce((sum, item) => {
        const menuItem = menuItems.find(mi => mi.id === item.menuItemId)
        return sum + (menuItem.price * item.quantity)
      }, 0)

      setSubmitting(true)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          items: itemsToOrder,
          total,
          address: orderData.address,
          phone: orderData.phone
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order')
      }

      setOrderSuccess(true)
      setQuantities({})
      setOrderData({ address: '', phone: '' })
      
      router.push('/order-confirmation')
    } catch (error) {
      console.error('Error placing order:', error)
      setOrderError(error.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalPrice = menuItems.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 0),
    0
  )

  const hasItemsSelected = Object.values(quantities).some(qty => qty > 0)

  if (userLoading || menuLoading) {
    return <div className="text-center mt-5 pt-5">Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Order - Vander Restaurant</title>
      </Head>
      <div className={styles.orderContainer}>
        <h1 className={styles.orderTitle}>Order Online</h1>

        {orderSuccess && (
          <div className={styles.alert + ' ' + styles.alertSuccess}>
            Your order was placed successfully!
          </div>
        )}

        {orderError && (
          <div className={styles.alert + ' ' + styles.alertDanger}>
            {orderError}
          </div>
        )}

        <div className={styles.orderCard}>
          <h3 className={styles.cardTitle}>Select Items</h3>

          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id}>
                    <td className={styles.itemName}>{item.name}</td>
                    <td>Nu. {item.price}</td>
                    <td>
                      <input
                        type="number"
                        className={styles.quantityInput}
                        min="0"
                        value={quantities[item.id] || 0}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10)
                          handleQuantityChange(item.id, isNaN(value) ? 0 : value)
                        }}
                      />
                    </td>
                    <td>Nu. {(item.price * (quantities[item.id] || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasItemsSelected && (
            <div className={styles.deliveryInfo}>
              <h4>Delivery Information</h4>
              <div className={styles.formGrid}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Delivery Address"
                  name="address"
                  value={orderData.address}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  className={styles.input}
                  placeholder="Phone Number"
                  name="phone"
                  value={orderData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <div className={styles.orderSummary}>
            <h3>Total: Nu. {totalPrice}</h3>
            <button
              className={styles.orderButton}
              onClick={placeOrder}
              disabled={!hasItemsSelected || !orderData.address || !orderData.phone || submitting}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}