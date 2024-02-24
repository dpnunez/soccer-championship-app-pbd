import { cn } from '@/lib/utils'
import { Badge } from './ui'

type CHStatus = 'not_started' | 'started' | 'finished'

const statusToText = {
  started: 'Iniciado',
  not_started: 'Não iniciado',
  finished: 'Finalizado',
}

export const ChampionshipStatus = ({ status }: { status: CHStatus }) => {
  return (
    <Badge
      className={cn('text-white text-nowrap', {
        'bg-red-500': status === 'not_started',
        'bg-yellow-500': status === 'started',
        'bg-green-500': status === 'finished',
      })}
    >
      {statusToText[status]}
    </Badge>
  )
}
