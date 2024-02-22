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
  match: {
    home_team: number
    visiting_team: number
  }
}

export default async function Page({ params }: Props) {
  const idMatch = params.idMatch
  const { data: match } = await api.get<Match>(`/api/match/register/${idMatch}`)
  const home = match.teams[match.match.home_team]
  const visiting = match.teams[match.match.visiting_team]

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
