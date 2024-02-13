import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui'
import { api } from '@/lib/api'
import { useToast } from '../ui/use-toast'

export const CreatePlayerForm = () => {
  const { toast } = useToast()

  const form = useForm({
    defaultValues: {
      name: '',
      age: '',
      origin: '',
      //   picture: '',
      dominantLeg: 'R',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const { toastInfo } = await api.post('/api/player/create', data)
      if (toastInfo) toast(toastInfo)
    } catch (err) {
      console.log(err)
    }
  })

  return (
    <Form {...form}>
      <form id="create-player-form" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Jogador</FormLabel>
              <FormControl>
                <Input placeholder="Nome do Campeonato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Idade</FormLabel>
              <FormControl>
                <Input placeholder="Idade" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Campeonato</FormLabel>
              <FormControl>
                <Input placeholder="Nome do Campeonato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origem</FormLabel>
              <FormControl>
                <Input placeholder="Pelotas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dominantLeg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="L">Esquerda</SelectItem>
                  <SelectItem value="R">Direita</SelectItem>
                  <SelectItem value="A">Ambidestro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
