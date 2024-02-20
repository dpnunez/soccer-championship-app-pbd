'use client'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { api } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form'

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
          <Button onClick={() => console.log(form.getValues())}>
            Get Form Values
          </Button>
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
                        <SelectValue placeholder="Select a verified email to display" />
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
        onClick={() => {
          append({ player: null })
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
