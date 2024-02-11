import { getServerSession } from 'next-auth'
import Link from 'next/link'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()

  if (!session?.user)
    return (
      <div>
        <h1>Not logged in</h1>
        <Link href="/sign-in">Sign in</Link>
      </div>
    )

  return <>{children}</>
}
