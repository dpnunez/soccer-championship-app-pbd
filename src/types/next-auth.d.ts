// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    username: string
    name: string
    type: 'admin' | 'owner'
  }
  interface Session {
    user: User & {
      username: string
      type: 'admin' | 'owner'
    }
    token: {
      username: string
    }
  }
}
