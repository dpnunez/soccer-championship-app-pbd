import { api } from '@/lib/api'
import { authConfig } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { ChampionshipTable } from './Table'

interface Props {
  params: {
    id: string
  }
}

interface Match {
  id: number
  home_team: number
  visiting_team: number
  is_registered: boolean
  home_goals: number
  visiting_goals: number
  referee: {
    name: string
  }
}

interface Team {
  id: number
  team: {
    name: string
  }
}

interface Teams {
  [key: string]: Team
}

interface Rounds {
  [key: string]: Match[]
}

export default async function Page({ params }: Props) {
  const id = params.id
  const session = await getServerSession(authConfig)
  const { data } = await api.get(`/api/championship/${id}`)
  const {
    data: { table },
  } = await api.get(`/api/championship/${id}/table`)
  const rounds: Rounds = data.rounds
  const teams: Teams = data.teams

  const isAdmin = session?.user.type === 'admin'

  return (
    <div>
      <h1 className="text-2xl font-bold">Campeonatos</h1>

      <ChampionshipTable data={table} />
      {Object.entries(rounds).map(([round, matches]) => (
        <div key={round}>
          <h2>Rodada {round}</h2>
          {matches.map((match) => (
            <div key={match.id} className="bg-slate-400 p-2 m-2">
              <div>
                {teams[match.home_team].team.name} {match.home_goals} x{' '}
                {match.visiting_goals} {teams[match.visiting_team].team.name}
              </div>
              <span>
                is registered - {JSON.stringify(match.is_registered)}
                {match.referee && ` - Árbitro: ${match.referee.name}`}
              </span>
              {isAdmin && !match.is_registered && (
                <Link
                  href={`/admin/championship/${id}/match/${match.id}`}
                  className="p-4 bg-black/15 box-border"
                >
                  Cadastrar resultado
                </Link>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
