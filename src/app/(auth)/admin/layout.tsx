import { SignOutButton } from '@/components/SignOutButton'
import { Button } from '@/components/ui'
import { AvatarIcon } from '@radix-ui/react-icons'
import { signOut } from 'next-auth/react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <header className="flex p-5 bg-slate-950 text-slate-50 justify-between items-center mb-10">
        <h2 className="text-2xl font-bold">Admin</h2>
        <div className="flex items-center gap-4">
          <h3>Seja bem vindo, [nome]</h3>
          <SignOutButton />
        </div>
      </header>
      <main className="max-w-6xl w-full mx-auto">{children}</main>
    </div>
  )
}
