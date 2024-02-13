import { PlayersForm } from '@/components/forms/PlayersForm'
import { api } from '@/lib/api'
import { authConfig } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'

interface Props {
  params: {
    id: string
  }
}

// ToDo: find interface
export default async function Page({ params }: Props) {
  const session = await getServerSession(authConfig)
  const username = session?.user.username
  const { data } = await api.get(`/api/championship/owner/${params.id}`)
  const { data: playersSelected } = await api.get<number[]>(
    `/api/player/subscribe?username=${username}&championship=${params.id}`,
  )

  return (
    <div>
      {data.name}

      <PlayersForm initialPlayers={playersSelected} />
    </div>
  )
}
