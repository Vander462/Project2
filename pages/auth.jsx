import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/Auth/AuthForm';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login');

  useEffect(() => {
    const detectFirstUser = async () => {
      try {
        const res = await fetch('/api/users/count');
        const { count } = await res.json();
        if (count === 0) setMode('register');
        else setMode(router.query.mode || 'login');
      } catch (err) {
        setMode('login');
      }
    };

    detectFirstUser();
  }, [router.query.mode]);

  return (
    <>
      <title>{mode === 'login' ? 'Login' : 'Register'}</title>
      <AuthForm mode={mode} />
    </>
  );
}
