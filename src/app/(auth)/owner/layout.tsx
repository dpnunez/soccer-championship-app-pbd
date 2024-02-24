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
      <div className="max-w-7xl w-full mx-auto mb-11">
        <main className="mx-4">
          <div>{children}</div>
        </main>
      </div>
    </div>
  )
}
