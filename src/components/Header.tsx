import { Avatar, AvatarFallback, Card, DropdownMenu } from '@/components/ui'
import { authConfig } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'
import { SignOutButton } from './SignOutButton'
import { ThemePicker } from './ThemePicker'

export default async function Header({ children }: React.PropsWithChildren) {
  const session = await getServerSession(authConfig)

  return (
    <div className="h-28">
      <header className="w-screen fixed z-10">
        <div className="mx-auto w-full relative max-w-7xl">
          <Card className="p-4 m-4 flex items-center justify-between bg-background/70 backdrop-blur-lg">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>{session?.user.name[0]}</AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-medium">{session?.user.name}</h2>
            </div>
            <div className="flex items-center gap-4">{children}</div>
            <div className="flex gap-3">
              <ThemePicker />
              <SignOutButton />
            </div>
          </Card>
        </div>
      </header>
    </div>
  )
}
