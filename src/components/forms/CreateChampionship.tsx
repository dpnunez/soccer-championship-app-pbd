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
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { ChampionshipForm, championshipSchema } from '@/lib/validations'
import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TeamEmblem } from '@/components/TeamEmblem'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { AxiosError } from 'axios'

interface Team {
  id: number
  name: string
  emblem: string
}

interface SelectTeams {
  teams: Team[]
}

const SelectTeams = ({ teams }: SelectTeams) => {
  return (
    <div className="grid grid-flow-col gap-4">
      {teams.map((team) => (
        <Team key={team.id} {...team} />
      ))}
    </div>
  )
}

const Team = ({ name, id, emblem }: Team) => {
  const form = useFormContext()
  const teams: number[] = form.watch('teams')
  const isSelected = teams.includes(id)

  const handleClick = () => {
    if (isSelected) {
      form.setValue(
        'teams',
        teams.filter((team) => team !== id),
      )
    } else {
      form.setValue('teams', [...teams, id])
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'flex flex-col rounded-lg p-3 items-center hover:bg-slate-300 transition-all cursor-pointer ',
        {
          'bg-gray-100 ring-1 ring-slate-300': isSelected,
        },
      )}
    >
      <TeamEmblem emblem={emblem} className="w-16" />
      {name}
    </div>
  )
}

export function CreateChampionshipForm({ teams }: { teams: Team[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<ChampionshipForm>({
    resolver: zodResolver(championshipSchema),
    defaultValues: {
      name: '',
      teams: [],
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const res = await api.post('/api/championship', values)
      toast({
        title: 'Campeonato criado com sucesso',
        description: `O campeonato ${res.data.name} foi criado com sucesso!`,
      })

      router.push('/admin')
    } catch (err) {
      toast((err as AxiosError).toastInfo)
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <h1 className="text-3xl font-bold mb-10">Cadastrar Campeonato</h1>
        <div className="flex flex-col gap-10">
          <FormField
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
          />
          <div>
            <h2 className="text-2xl font-bold">Participantes</h2>
            <SelectTeams teams={teams} />
          </div>
          <Button>Criar Campeonato</Button>
        </div>
      </form>
    </Form>
  )
}
