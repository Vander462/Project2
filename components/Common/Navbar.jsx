import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '../../context/user.Context'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const { user, loading, logout } = useUser()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [error, setError] = useState('')

  const isActive = (pathname) => router.pathname === pathname

  const handleLogout = async () => {
    try {
      const result = await logout()
      if (!result.success) {
        throw new Error(result.error || 'Failed to logout')
      }
      setIsUserMenuOpen(false)
    } catch (err) {
      setError(err.message)
      console.error('Logout error:', err)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">Vander</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>Menu</Link>
            </li>
            <li className="nav-item">
              <Link href="/order" className={`nav-link ${isActive('/order') ? 'active' : ''}`}>Order</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
            </li>

            {error && (
              <li className="nav-item">
                <div className="alert alert-danger py-1 px-2 mb-0">
                  {error}
                </div>
              </li>
            )}

            {!loading && (
              <>
                {user ? (
                  <>
                    {user.role === 'ADMIN' && (
                      <li className="nav-item">
                        <Link href="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Admin</Link>
                      </li>
                    )}
                    <li className="nav-item dropdown">
                      <button
                        className="nav-link btn btn-link dropdown-toggle d-flex align-items-center"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsUserMenuOpen(!isUserMenuOpen)
                          setError('') // Clear any previous errors
                        }}
                      >
                        <span className="me-2">
                          <i className="fas fa-user-circle"></i>
                        </span>
                        {user.name || user.email}
                      </button>
                      <div 
                        className={`dropdown-menu dropdown-menu-end ${isUserMenuOpen ? 'show' : ''}`}
                        style={{
                          position: 'absolute',
                          transform: 'translate3d(0px, 40px, 0px)',
                          top: 0,
                          right: 0,
                          willChange: 'transform'
                        }}
                      >
                        <Link href="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                          <i className="fas fa-user me-2"></i>Profile
                        </Link>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                          <i className="fas fa-sign-out-alt me-2"></i>Logout
                        </button>
                      </div>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link href="/auth" className={`nav-link ${isActive('/auth') ? 'active' : ''}`}>
                      <i className="fas fa-sign-in-alt me-1"></i>
                      Login
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
