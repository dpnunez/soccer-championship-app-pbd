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
import { api } from '@/lib/api'
import { useForm } from 'react-hook-form'

export default function LoginPage() {
  const idProduction = process.env.NODE_ENV === 'production'

  const form = useForm()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await api.post('/api/admin', data)
      console.log(response)
    } catch {
      console.log('erro')
    }
  })

  if (idProduction) {
    return null
  }

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
