import { authConfig } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const redirectUrl = {
  owner: '/owner',
  admin: '/admin',
}

export default async function Home() {
  const session = await getServerSession(authConfig)

  if (session?.user) redirect(redirectUrl[session?.user?.type])
  redirect('/sign-in')

  return null
}
