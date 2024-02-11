'use client'

import { signOut } from 'next-auth/react'
import { Button } from './ui'

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
    >
      Sair
    </Button>
  )
}
