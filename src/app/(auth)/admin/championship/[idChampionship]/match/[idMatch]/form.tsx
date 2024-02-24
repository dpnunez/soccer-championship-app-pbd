'use client'

import { TeamEmblem } from '@/components/TeamEmblem'
import {
  Badge,
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
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { api, fetcher } from '@/lib/api'
import { MatchForm, matchSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CardStackIcon,
  CheckIcon,
  PlusIcon,
  TargetIcon,
  TrashIcon,
} from '@radix-ui/react-icons'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form'
import useSWR from 'swr'

interface Card {
  player: string
  is_red: boolean
}
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
  round: number
}

interface TeamFormId extends Team {
  formId: 'home' | 'visiting'
  players: Player[]
}

export const RegisterMatchForm = ({
  round,
  homeId,
  match,
  visitingId,
  playersByTeam,
}: Props) => {
  const router = useRouter()
  const params = useParams()
  const home: TeamFormId = {
    ...match.teams[homeId],
    formId: 'home',
    players: playersByTeam[homeId],
  }

  const visiting: TeamFormId = {
    ...match.teams[visitingId],
    formId: 'visiting',
    players: playersByTeam[visitingId],
  }

  const form = useForm<MatchForm>({
    resolver: zodResolver(matchSchema),
  })

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

      const home_cards = data.cards[home.formId].map((card: Card) => ({
        id_player: Number(card.player),
        is_red: card.is_red,
        id_team: homeId,
      }))

      const visiting_cards = data.cards[visiting.formId].map((card: Card) => ({
        id_player: Number(card.player),
        is_red: card.is_red,
        id_team: visitingId,
      }))

      const cards = [...home_cards, ...visiting_cards]

      const goals = [...homeGoals, ...visitingGoals]

      await api.post(`/api/match/register/${params.idMatch}`, {
        goals,
        id_referee: data.id_referee,
        cards,
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
          <div className="flex justify-between items-center">
            <Header round={round} home={home} visiting={visiting} />
            <RefereeSection />
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <div className="flex gap-2 items-center">
                <h1 className="text-2xl font-bold">Gols</h1>
                <TargetIcon width={24} height={24} />
              </div>
              <div className="flex gap-10">
                <GoalRegister team={home} />
                <GoalRegister team={visiting} />
              </div>
            </div>
            <div>
              <div className="flex gap-2 items-center m">
                <h1 className="text-2xl font-bold">Cartões</h1>
                <CardStackIcon width={24} height={24} />
              </div>

              <div className="flex gap-10">
                <CardRegister team={home} />
                <CardRegister team={visiting} />
              </div>
            </div>

            <Button size="lg" type="submit">
              <CheckIcon />
              Enviar
            </Button>
            {/* <Button type="button" onClick={() => console.log(form.getValues())}>
              Logar
            </Button> */}
          </div>
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

  const players = team.players || []

  return (
    <div className="flex-1">
      <h2 className="text-lg font-medium my-4">{team.name}</h2>
      <div className="flex-col flex">
        {players.length === 0 ? (
          <h3 className="text-3xl text-foreground mx-auto opacity-25">
            Nenhum jogador cadastrado
          </h3>
        ) : (
          fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-3 mb-6">
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
                        {team.players.map((player) => (
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
              <Button
                size="icon"
                variant="destructive"
                type="button"
                onClick={() => {
                  remove(index)
                }}
              >
                <TrashIcon width={16} height={16} />
              </Button>
            </div>
          ))
        )}
      </div>
      {players.length === 0 ? null : (
        <Button
          type="button"
          onClick={() => {
            append({ player: undefined })
          }}
          className="flex items-center gap-2 mt-4"
        >
          <PlusIcon />
          Adicionar Gol
        </Button>
      )}
    </div>
  )
}

const CardRegister = ({ team }: GoalRegisterProps) => {
  const form = useFormContext()
  const { fields, append, remove } = useFieldArray({
    name: `cards.${team.formId}`,
    control: form.control,
  })

  const playersAlreadyWithCard = (form.watch(`cards.${team.formId}`) || []).map(
    (card: Card) => Number(card.player),
  )

  const players = team.players || []

  return (
    <div className="flex-1">
      <h2 className="text-lg font-medium my-4">{team.name}</h2>
      <div className="flex-col flex">
        {players.length === 0 ? (
          <h3 className="text-3xl text-foreground mx-auto opacity-25">
            Nenhum jogador cadastrado
          </h3>
        ) : (
          fields.map((field, index) => (
            <div className="flex mb-10 items-center gap-4" key={field.id}>
              <div className="flex flex-col flex-1">
                <FormField
                  control={form.control}
                  name={`cards.${team.formId}.${index}.player`}
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
                          {players.map((player) => (
                            <SelectItem
                              disabled={playersAlreadyWithCard.includes(
                                player.id,
                              )}
                              key={player.id}
                              value={String(player.id)}
                            >
                              {player.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`cards.${team.formId}.${index}.is_red`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                      <FormControl className="flex items-center">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Cartão vermelho</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                size="icon"
                variant="destructive"
                type="button"
                onClick={() => {
                  remove(index)
                }}
              >
                <TrashIcon width={16} height={16} />
              </Button>
            </div>
          ))
        )}
      </div>
      {players.length === 0 ? null : (
        <Button
          type="button"
          onClick={() => {
            append({ player: undefined, is_red: false })
          }}
          className="flex items-center gap-2 mt-4"
        >
          <PlusIcon />
          Adicionar Cartão
        </Button>
      )}
    </div>
  )
}

interface HeaderProps {
  home: Team
  visiting: Team
  round: number
}

const Header = ({ home, visiting, round }: HeaderProps) => {
  const form = useFormContext()

  const homeGoals = form.watch('goals.home')
  const visitingGoals = form.watch('goals.visiting')

  return (
    <div className="mb-10">
      <Badge className="bg-foreground/60">Rodada {round}</Badge>
      <div className="flex mt-3">
        <div className="flex items-center gap-4">
          <TeamEmblem className="h-8" emblem={home.emblem} />
          <h3 className="text-2xl font-semibold">{home.name}</h3>
          <span className="text-3xl">{homeGoals?.length ?? 0}</span>
        </div>
        <span className="text-4xl mx-9">vs</span>

        <div className="flex items-center gap-4">
          <span className="text-3xl">{visitingGoals?.length ?? 0}</span>
          <h3 className="text-2xl font-semibold">{visiting.name}</h3>
          <TeamEmblem className="h-8" emblem={visiting.emblem} />
        </div>
      </div>
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
    <div className="flex items-end gap-4">
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
      <Button
        variant="secondary"
        className="flex items-center gap-2"
        type="button"
        onClick={() => setCreateRefereeDialog(true)}
      >
        <PlusIcon />
        Criar Árbitro
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
      </form>
    </Form>
  )
}
