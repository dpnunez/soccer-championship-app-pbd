import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import { FormSignIn } from './Form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="max-w-full w-[400px]">
        <CardHeader>
          <div className="flex items-center justify-center h-14 relative">
            <img
              src="/ball.png"
              alt="Logo"
              className="absolute bottom-7 h-[200%]"
            />
          </div>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <FormSignIn />
        </CardContent>

        <CardFooter>
          <Button form="sign-in" className="w-full">
            Acessar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
