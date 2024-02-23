'use client'

import { signOut } from 'next-auth/react'
import { Button } from './ui'
import { ExitIcon } from '@radix-ui/react-icons'

export const SignOutButton = () => {
  return (
    <Button
      onClick={async () => {
        signOut({
          redirect: true,
          callbackUrl: '/',
        })
      }}
      variant="destructive"
      className="flex gap-2"
    >
      <ExitIcon />
      Sair
    </Button>
  )
}
