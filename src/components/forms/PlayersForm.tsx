'use client'

import { useState } from 'react'
import {
  Button,
  Card,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui'
import { CreatePlayerForm } from './CreatePlayerForm'
import { api, fetcher } from '@/lib/api'
import useSWR from 'swr'
import { cn } from '@/lib/utils'
import { useParams } from 'next/navigation'
import { useToast } from '../ui/use-toast'
import { AxiosError } from 'axios'
import { PersonIcon, PlusIcon } from '@radix-ui/react-icons'

interface DialogProps {
  open: boolean
  handleClose: () => void
}

const CreatePlayerDialog = ({ open, handleClose }: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogClose onClick={handleClose} />
          <DialogTitle>Time criado com sucesso</DialogTitle>
          <DialogDescription>Crie um jogador novo</DialogDescription>
        </DialogHeader>
        <CreatePlayerForm />
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="create-player-form">
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface Player {
  id: number
  name: string
  age: number
  origin: string
  dominant_leg: string
}
interface PlayerList {
  data: Player[]
}

const SelectPlayers = ({
  players,
  initial,
}: {
  players: Player[]
  initial: number[]
}) => {
  const { toast } = useToast()
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>(initial)
  const { id } = useParams()

  const handleClickPlayer = (id: number) => {
    if (selectedPlayers.includes(id)) {
      setSelectedPlayers(selectedPlayers.filter((player) => player !== id))
    } else {
      setSelectedPlayers([...selectedPlayers, id])
    }
  }

  const onSave = async () => {
    try {
      const { toastInfo } = await api.post('/api/player/subscribe', {
        players: selectedPlayers,
        championship: Number(id),
      })
      if (toastInfo) toast(toastInfo)
    } catch (err) {
      toast((err as AxiosError).toastInfo)
    }
  }

  return (
    <div>
      <h3 className="text-md text-primary opacity-45 mt-6 mb-2">
        Selecione os jogadores
      </h3>
      <div className="flex gap-4 flex-wrap ">
        {players.map((player) => (
          <Card
            className={cn(
              'p-2 text-nowrap px-4 cursor-pointer transition-all',
              {
                'bg-foreground text-primary-foreground':
                  selectedPlayers.includes(player.id),
              },
            )}
            key={player.id}
            onClick={() => handleClickPlayer(player.id)}
          >
            <p>{player.name}</p>
          </Card>
        ))}
      </div>

      <Button className="my-10" onClick={onSave}>
        Salvar jogadores
      </Button>
    </div>
  )
}

export const PlayersForm = ({
  initialPlayers,
}: {
  initialPlayers: number[]
}) => {
  const [createPlayerModal, setCreatePlayerModal] = useState(false)
  const { data: players, mutate } = useSWR<PlayerList>('/api/player', fetcher)
  const list = players?.data ?? []

  return (
    <div className="mt-10">
      <div className="flex gap-6 items-center">
        <div className="flex gap-4 items-center">
          <PersonIcon width={24} height={24} />
          <h2 className="text-xl font-semibold">Jogadores</h2>
        </div>
        <Button
          variant="outline"
          onClick={() => setCreatePlayerModal(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon />
          Criar jogador
        </Button>
      </div>
      <div className="flex gap-4">
        <SelectPlayers players={list} initial={initialPlayers} />
      </div>
      <CreatePlayerDialog
        open={createPlayerModal}
        handleClose={() => {
          setCreatePlayerModal(false)
          mutate()
        }}
      />
    </div>
  )
}
