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

export default function LoginPage() {
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
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Nome de usuário" />
          <Input placeholder="Senha" type="password" />
        </CardContent>

        <CardFooter>
          <Button className="w-full">Acessar</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
