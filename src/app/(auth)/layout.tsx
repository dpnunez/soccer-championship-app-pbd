import { authConfig } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AuthHandler({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authConfig)
  if (!session) {
    redirect('/sign-in')
  }

  return <div>{children}</div>
}
