import { AvatarIcon } from '@radix-ui/react-icons'

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
          <AvatarIcon width={32} height={32} />
        </div>
      </header>
      <main className="max-w-6xl w-full mx-auto">{children}</main>
    </div>
  )
}
