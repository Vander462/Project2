import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useUser } from '../lib/auth'

export default function OrderConfirmationPage() {
  const router = useRouter()
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="text-center mt-5 pt-5">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Order Confirmation - Vander Restaurant</title>
      </Head>
      <div className="container mt-5 pt-5">
        <div className="card">
          <div className="card-body text-center">
            <div className="mb-4">
              <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
            </div>
            <h1 className="card-title mb-4">Thank You for Your Order!</h1>
            <p className="card-text">
              Your order has been successfully placed and is being processed.
            </p>
            <p className="card-text">
              We will notify you when your order is ready.
            </p>
            <div className="mt-4">
              <Link href="/menu" className="btn btn-primary">
                Order More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 