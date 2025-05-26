import Head from 'next/head'
import Navbar from '../Common/Navbar'

export default function Layout({ children, title = 'Vander Restaurant' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Vander Restaurant - Best food in town" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-vh-100 d-flex flex-column">
        <Navbar />
        <main className="flex-grow-1 mt-5 pt-4">
          {children}
        </main>
      </div>
    </>
  )
}