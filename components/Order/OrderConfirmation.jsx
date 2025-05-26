// components/Order/OrderConfirmation.jsx
import Link from 'next/link'

export default function OrderConfirmation() {
  return (
    <div className="container mt-5 pt-5 text-center">
      <h2 className="mb-4 text-success">✅ Your order has been placed!</h2>
      <p>Thank you for ordering from Vander Restaurant.</p>
      <Link href="/" className="btn btn-primary mt-3">Back to Home</Link>
    </div>
  )
}
