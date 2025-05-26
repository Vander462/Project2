import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useUser } from '../context/user.Context';
import styles from '../styles/Profile.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="text-center mt-5 pt-5">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>My Profile - Vander Restaurant</title>
      </Head>
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body">
                <h1 className="card-title text-center mb-4">My Profile</h1>
                <div className="text-center mb-4">
                  <div className="avatar-placeholder mb-3">
                    <i className="fas fa-user fa-3x"></i>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5>Name</h5>
                    <p>{user.name}</p>
                  </div>
                  <div className="col-md-6">
                    <h5>Email</h5>
                    <p>{user.email}</p>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5>Role</h5>
                    <p>{user.role}</p>
                  </div>
                  <div className="col-md-6">
                    <h5>Member Since</h5>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 