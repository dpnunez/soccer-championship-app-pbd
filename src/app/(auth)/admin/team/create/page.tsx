'use client'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components/ui'
import { useForm } from 'react-hook-form'

export default function CreateTeamPage() {
  const form = useForm()

  const emblem = form.watch('emblem')

  const onSubmit = () => {
    console.log('aqui')
  }

  const isLinkRegex = /^(http|https):\/\/[^ "]+$/
  const isValidLink = isLinkRegex.test(emblem)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold mb-10">Cadastrar Time</h1>
        <div className="flex gap-4">
          <div className="flex flex-col flex-[4] justify-between mr-11">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do time</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emblem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link para emblema do time</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Criar Time</Button>
          </div>
          <div className="overflow-hidden flex-1 ring-slate-200 ring-1 rounded-lg">
            <img
              src={
                isValidLink
                  ? emblem
                  : 'https://img.freepik.com/premium-vector/soccer-badge-vector-template-football-graphic-illustration-badge-emblem-designs-style_687309-509.jpg?w=1800'
              }
              className="flex-1 aspect-square"
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
