'use client'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useUser } from '../../context/user.Context'

export default function AuthForm({ mode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useUser()

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (mode === 'register' && !name) {
      setError('Please enter your name')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      if (mode === 'login') {
        const result = await login(email, password)
        if (!result.success) {
          throw new Error(result.error || 'Login failed')
        }
        router.push('/menu')
      } else {
        // Register mode
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, mode }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'Registration failed')
        }

        // After successful registration, login automatically
        const loginResult = await login(email, password)
        if (!loginResult.success) {
          throw new Error('Auto-login after registration failed')
        }

        router.push('/menu')
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err.message || 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                {mode === 'login' ? 'Login' : 'Register'}
              </h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        setError('')
                      }}
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    required
                    minLength={6}
                  />
                  <small className="form-text text-muted">
                    {mode === 'register' ? 'Password must be at least 6 characters long' : ''}
                  </small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Register'}
                </button>
              </form>

              <div className="mt-3 text-center">
                {mode === 'login' ? (
                  <p>
                    Don&apos;t have an account?{' '}
                    <Link href="/auth?mode=register">Register</Link>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <Link href="/auth?mode=login">Login</Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
