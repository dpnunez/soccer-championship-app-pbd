'use client'

import { useState } from 'react'
import {
  Button,
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

      toast(toastInfo)
    } catch (err) {
      toast(err.toastInfo)
    }
  }

  return (
    <div>
      <h2>Selecione os jogadores</h2>
      <div className="flex gap-4">
        {players.map((player) => (
          <div
            className={cn('bg-slate-100', {
              'bg-slate-200 ring-1 ring-slate-400 cursor-pointer':
                selectedPlayers.includes(player.id),
            })}
            key={player.id}
            onClick={() => handleClickPlayer(player.id)}
          >
            <p>{player.name}</p>
          </div>
        ))}
      </div>

      <Button onClick={onSave}>Salvar jogadores</Button>
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
    <div>
      <h2>Jogadores</h2>

      <Button onClick={() => setCreatePlayerModal(true)}>Criar jogador</Button>
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

// <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogClose onClick={handleClose} />
//           <DialogTitle>Time criado com sucesso</DialogTitle>
//           <DialogDescription>
//             A seguir você terá acesso as informações da conta para acessar o
//             time
//           </DialogDescription>
//         </DialogHeader>
//         <div>
//           <p>username: {username}</p>
//           <p>password: {tempPassword}</p>
//         </div>
//         <DialogFooter>
//           <Button onClick={handleClose}>Fechar</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
