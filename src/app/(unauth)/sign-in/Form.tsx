'use client'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import z from 'zod'

const schema = z.object({
  username: z.string().min(3, {
    message: 'Nome de usuário obrigatório',
  }),
  password: z.string().min(3, {
    message: 'Senha obrigatória',
  }),
})

export function FormSignIn() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const router = useRouter()
  const { toast } = useToast()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await signIn('credentials', {
        redirect: false,
        username: data.username,
        password: data.password,
      })

      if (response?.ok) {
        router.push('/auth')
        return
      }
      toast({
        title: 'Credentials invalid',
        description: 'Usuário ou senha inválidos',
        variant: 'destructive',
      })
    } catch {
      console.log('erro')
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" id="sign-in">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de Usuário</FormLabel>
              <FormControl>
                <Input placeholder="team-..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
