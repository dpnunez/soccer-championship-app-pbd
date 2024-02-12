import { authConfig } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AuthHandler() {
  const session = await getServerSession(authConfig)
  const userRole = session?.user?.type
  if (userRole === 'admin') {
    redirect('/admin')
  } else if (userRole === 'owner') {
    redirect('/owner')
  }

  return <div>Error on auth handler</div>
}
