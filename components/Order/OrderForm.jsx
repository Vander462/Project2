// components/Order/OrderForm.jsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const foodItems = [
  { id: 1, name: "Paneer Butter Masala", price: 10.99, image: "/images/veg1.jpg" },
  { id: 2, name: "Vegetable Biryani", price: 8.99, image: "/images/veg2.jpg" },
  { id: 3, name: "Dal Tadka", price: 6.99, image: "/images/veg3.jpeg" },
  { id: 4, name: "Chicken Curry", price: 12.99, image: "/images/non1.jpg" },
  { id: 5, name: "Mutton Rogan Josh", price: 14.99, image: "/images/non2.jpeg" },
  { id: 6, name: "Fish Fry", price: 13.99, image: "/images/non3.jpeg" },
  { id: 7, name: "Chocolate Lava Cake", price: 5.99, image: "/images/cake.jpg" },
]

export default function OrderForm() {
  const router = useRouter()
  const { itemId } = router.query

  const [quantity, setQuantity] = useState(1)
  const [customerName, setCustomerName] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const item = foodItems.find(f => f.id === parseInt(itemId))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!item) return

    setSubmitting(true)

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: item.id,
        itemName: item.name,
        quantity,
        customerName,
        address,
        total: (item.price * quantity).toFixed(2)
      })
    })

    if (res.ok) {
      router.push('/order/confirmation')
    } else {
      alert('Failed to place order')
      setSubmitting(false)
    }
  }

  if (!item) return <p className="text-center mt-5">Loading...</p>

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4 text-center">Order: {item.name}</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                min={1}
                required
              />
            </div>
            <div className="mb-3 text-end">
              <strong>Total: ${ (item.price * quantity).toFixed(2) }</strong>
            </div>
            <button type="submit" className="btn btn-success w-100" disabled={submitting}>
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
