import { ChampionshipStatus } from '@/components/ChampionshipStatus'
import { PlayersForm } from '@/components/forms/PlayersForm'
import { api } from '@/lib/api'
import { authConfig } from '@/lib/next-auth'
import { Championship } from '@/types/Entities'
import { getServerSession } from 'next-auth'

interface Props {
  params: {
    id: string
  }
}

interface ResponseChampionhip {
  championship: Championship
}

export default async function Page({ params }: Props) {
  const session = await getServerSession(authConfig)
  const username = session?.user.username
  const {
    data: { championship },
  } = await api.get<ResponseChampionhip>(`/api/championship/${params.id}`)
  const { data: playersSelected } = await api.get<number[]>(
    `/api/player/subscribe?username=${username}&championship=${params.id}`,
  )

  console.log(championship.status)
  return (
    <div>
      <div className="flex gap-3">
        <h1 className="text-2xl font-bold">{championship.name}</h1>
        <ChampionshipStatus status={championship.status} />
      </div>
      <PlayersForm initialPlayers={playersSelected} />
    </div>
  )
}
