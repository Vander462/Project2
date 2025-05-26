import { UserProvider } from '../context/user.Context'
import Layout from '../components/Layouts/Layout'
import '../public/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  )
}