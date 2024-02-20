import { api } from '@/lib/api'
import { RegisterMatchForm } from './form'

interface Props {
  params: {
    idChampionship: string
    idMatch: string
  }
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

interface Match {
  id: number
  teams: {
    [key: string]: Team
  }
  players: {
    [key: string]: Player[]
  }
}

export default async function Page({ params }: Props) {
  const idMatch = params.idMatch
  const { data: match } = await api.get<Match>(`/api/match/register/${idMatch}`)
  const [home, visiting] = Object.values(match.teams)

  console.log(match)

  return (
    <div>
      <RegisterMatchForm
        match={match}
        homeId={home.id}
        visitingId={visiting.id}
        playersByTeam={match.players}
      />
    </div>
  )
}
