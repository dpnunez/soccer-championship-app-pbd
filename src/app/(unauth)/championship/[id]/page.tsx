import { api } from '@/lib/api'

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
  const { data } = await api.get(`/api/championship/${id}`)
  const rounds: Rounds = data.rounds
  const teams: Teams = data.teams

  return (
    <div>
      <h1 className="text-2xl font-bold">Campeonatos</h1>

      <div>TABLE</div>
      {Object.entries(rounds).map(([round, matches]) => (
        <div key={round}>
          <h2>Rodada {round}</h2>
          {matches.map((match) => (
            <div key={match.id} className="bg-slate-400 p-2 m-2">
              <div>
                {teams[match.home_team].team.name} x{' '}
                {teams[match.visiting_team].team.name}
              </div>
              <span>is registered - {JSON.stringify(match.is_registered)}</span>
              {/* {teams[match.id_team_home][0].team.name} x{' '}
              {teams[match.id_team_visiting][0].team.name} */}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
