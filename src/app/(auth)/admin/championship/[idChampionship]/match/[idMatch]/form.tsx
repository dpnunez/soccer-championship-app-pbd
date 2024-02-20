'use client'

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from '@/components/ui'
import { useToast } from '@/components/ui/use-toast'
import { api, fetcher } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form'
import useSWR from 'swr'

interface Team {
  id: number
  name: string
  emblem: string
}

interface Player {
  id: number
  name: string
  id_team: number
}

interface Props {
  match: {
    id: number
    teams: {
      [key: string]: Team
    }
  }
  playersByTeam: {
    [key: string]: Player[]
  }

  homeId: number
  visitingId: number
}

export const RegisterMatchForm = ({
  homeId,
  match,
  visitingId,
  playersByTeam,
}: Props) => {
  const router = useRouter()
  const params = useParams()
  const home = {
    ...match.teams[homeId],
    formId: 'home',
    players: playersByTeam[homeId],
  }
  const visiting = {
    ...match.teams[visitingId],
    formId: 'visiting',
    players: playersByTeam[visitingId],
  }

  const form = useForm()

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const homeGoals = data.goals[home.formId].map(
        (goal: { player: string }) => ({
          id_player: Number(goal.player),
          id_team: homeId,
        }),
      )
      const visitingGoals = data.goals[visiting.formId].map(
        (goal: { player: string }) => ({
          id_player: Number(goal.player),
          id_team: visitingId,
        }),
      )

      const goals = [...homeGoals, ...visitingGoals]

      await api.post(`/api/match/register/${params.idMatch}`, {
        goals,
        id_referee: data.id_referee,
      })

      router.push(`/championship/${params.idChampionship}`)
    } catch (err) {
      console.log(err)
    }
  })

  return (
    <div>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <Header home={home} visiting={visiting} />
          <div className="flex">
            <GoalRegister team={home} />
            <GoalRegister team={visiting} />
          </div>

          <h2>Arbitragem</h2>
          <RefereeSection />
          <Button type="submit">Enviar</Button>
        </form>
      </Form>
    </div>
  )
}

interface GoalRegisterProps {
  team: {
    formId: string
    players: Player[]
  } & Team
}

const GoalRegister = ({ team }: GoalRegisterProps) => {
  const form = useFormContext()
  const { fields, append, remove } = useFieldArray({
    name: `goals.${team.formId}`,
    control: form.control,
  })

  return (
    <div className="flex-1">
      <h2>{team.name}</h2>
      <div className="flex-col flex">
        {fields.map((field, index) => (
          <div key={field.id} className="flex">
            <FormField
              control={form.control}
              name={`goals.${team.formId}.${index}.player`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Nome do jogador</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar Jogador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(team.players || []).map((player) => (
                        <SelectItem key={player.id} value={String(player.id)}>
                          {player.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="button"
              onClick={() => {
                remove(index)
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        onClick={() => {
          append({ player: undefined })
        }}
      >
        Add Goal
      </Button>
    </div>
  )
}

interface HeaderProps {
  home: Team
  visiting: Team
}

const Header = ({ home, visiting }: HeaderProps) => {
  const form = useFormContext()

  const homeGoals = form.watch('goals.home')
  const visitingGoals = form.watch('goals.visiting')

  return (
    <div>
      <h1>
        {home.name} {homeGoals?.length ?? 0} vs {visiting.name}{' '}
        {visitingGoals?.length ?? 0}
      </h1>
    </div>
  )
}

interface Referee {
  id: number
  name: string
}

const RefereeSection = () => {
  const [createRefereeDialog, setCreateRefereeDialog] = useState(false)
  const { data, mutate } = useSWR('/api/referee', fetcher)
  const referees = data?.data ?? []
  const form = useFormContext()

  return (
    <div className="flex">
      <FormField
        control={form.control}
        name="id_referee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Árbitro</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar árbitro" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {referees.map((referee: Referee) => (
                  <SelectItem key={referee.id} value={String(referee.id)}>
                    {referee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={() => setCreateRefereeDialog(true)}>
        Criar novo arbitro
      </Button>
      <CreateRefereeDialog
        open={createRefereeDialog}
        handleClose={() => {
          setCreateRefereeDialog(false)
          mutate()
        }}
      />
    </div>
  )
}

interface DialogProps {
  open: boolean
  handleClose: () => void
}

const CreateRefereeDialog = ({ open, handleClose }: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogClose onClick={handleClose} />
          <DialogTitle>Time criado com sucesso</DialogTitle>
          <DialogDescription>Crie um jogador novo</DialogDescription>
        </DialogHeader>
        <CreateRefereeForm handleClose={handleClose} />
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="create-referee-form">
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const CreateRefereeForm = ({
  handleClose,
}: {
  handleClose: () => void
}) => {
  const { toast } = useToast()

  const form = useForm({
    defaultValues: {
      name: '',
      age: '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const { toastInfo } = await api.post('/api/referee', data)
      if (toastInfo) toast(toastInfo)
      handleClose()
    } catch (err) {
      console.log(err)
    }
  })

  return (
    <Form {...form}>
      <form
        id="create-referee-form"
        onSubmit={(e) => {
          e.stopPropagation()
          onSubmit(e)
        }}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do árbitro</FormLabel>
              <FormControl>
                <Input placeholder="João" {...field} />
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
      </form>
    </Form>
  )
}
