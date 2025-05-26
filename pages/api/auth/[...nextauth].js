import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { findUserByEmail, verifyPassword } from '../../../lib/auth'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await findUserByEmail(credentials.email)
        if (!user) return null
        
        const isValid = await verifyPassword(credentials.password, user.password)
        if (!isValid) return null
        
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth?mode=login'
  }
})