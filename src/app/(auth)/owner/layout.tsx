import Header from '@/components/Header'
import { authConfig } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authConfig)

  const type = session?.user?.type

  if (type !== 'owner') {
    redirect('/owner')
  }

  return (
    <div>
      <Header />
      <main className="max-w-7xl w-full mx-auto">
        <div className="w-full mx-4">{children}</div>
      </main>
    </div>
  )
}
