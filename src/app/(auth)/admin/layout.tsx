import Header from '@/components/Header'
import { Button } from '@/components/ui'
import { authConfig } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authConfig)
  const type = session?.user?.type

  if (type !== 'admin') {
    redirect('/owner')
  }

  return (
    <div>
      <Header>
        <Link href="/admin">
          <Button variant="link">Home</Button>
        </Link>
        <Link href="/admin/team/create">
          <Button variant="link">Criar time</Button>
        </Link>
        <Link href="/admin/championship/create">
          <Button variant="link">Criar Campeonato</Button>
        </Link>
      </Header>
      <main className="max-w-7xl w-full mx-auto">
        <div className="w-full mx-4">{children}</div>
      </main>
    </div>
  )
}
