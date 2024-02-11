'use client'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function LoginPage() {
  const form = useForm()
  const router = useRouter()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await signIn('credentials', {
        redirect: false,
        username: data.username,
        password: data.password,
      })

      if (response?.ok) {
        router.push('/admin/team/create')
      }
    } catch {}
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="max-w-full w-[400px]">
        <CardHeader>
          <div className="flex items-center justify-center h-8 relative">
            <img
              src="/vercel.svg"
              alt="Logo"
              className="absolute bottom-8 h-[200%]"
            />
          </div>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4" id="login">
            <Input
              {...form.register('username')}
              placeholder="Nome de usuário"
            />
            <Input
              {...form.register('password')}
              placeholder="Senha"
              type="password"
            />
          </form>
        </CardContent>

        <CardFooter>
          <Button form="login" className="w-full">
            Acessar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
