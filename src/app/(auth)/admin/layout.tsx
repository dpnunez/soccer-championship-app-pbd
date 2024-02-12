import { SignOutButton } from '@/components/SignOutButton'
import { authConfig } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authConfig)
  const username = session?.user?.username

  return (
    <div>
      <header className="flex p-5 bg-slate-950 text-slate-50 justify-between items-center mb-10">
        <h2 className="text-2xl font-bold">Admin</h2>
        <div className="flex items-center gap-4">
          <h3>Seja bem vindo, {username}</h3>
          <SignOutButton />
        </div>
      </header>
      <main className="max-w-6xl w-full mx-auto">{children}</main>
    </div>
  )
}
