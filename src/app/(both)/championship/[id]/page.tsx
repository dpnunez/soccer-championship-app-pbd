import { api } from '@/lib/api'
import { authConfig } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { ChampionshipTable } from './Table'
import { Championship, Team as TeamGlobal } from '@/types/Entities'
import { Button, Card, Separator } from '@/components/ui'
import { TeamEmblem } from '@/components/TeamEmblem'
import { cn } from '@/lib/utils'
import { PlusIcon } from '@radix-ui/react-icons'

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
  team: TeamGlobal
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
  const championship: Championship = data.championship

  const isAdmin = session?.user.type === 'admin'

  console.log(rounds)

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">{championship.name}</h1>
      <Separator className="my-6" />
      <ChampionshipTable data={table} />
      <Separator className="my-6 mb-20" />
      <h2 className="text-xl font-medium mb-12">Rodadas</h2>
      {Object.entries(rounds).map(([round, matches]) => (
        <>
          <h2 className="text-lg font-medium">Rodada {round}</h2>
          <div key={round} className="grid grid-cols-3">
            {matches.map((match) => (
              <Card
                key={match.id}
                className="p-4 m-2 hover:saturate-150
                hover:scale-105 transition-transform duration-300 ease-in-out
              "
              >
                <div className="flex">
                  <div className="flex flex-col flex-1">
                    <div className="flex gap-4 items-center">
                      <TeamEmblem
                        className="w-10"
                        emblem={teams[match.home_team].team.emblem}
                      />
                      {teams[match.home_team].team.name}
                      <span className="ml-auto">{match.home_goals}</span>
                      <div
                        className={cn(
                          'w-2 aspect-square rounded-full bg-yellow-500 animate-pulse',
                          {
                            invisible: match.home_goals <= match.visiting_goals,
                          },
                        )}
                      />
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-4 items-center">
                      <TeamEmblem
                        className="w-10"
                        emblem={teams[match.visiting_team].team.emblem}
                      />
                      {teams[match.visiting_team].team.name}{' '}
                      <span className="ml-auto">{match.visiting_goals}</span>
                      <div
                        className={cn(
                          'w-2 aspect-square rounded-full bg-yellow-500 animate-bounce',
                          {
                            invisible: match.home_goals >= match.visiting_goals,
                          },
                        )}
                      />
                    </div>
                  </div>
                  {isAdmin && !match.is_registered && (
                    <div className="ml-4 flex items-center">
                      <Separator orientation="vertical" />
                      <Button asChild variant="outline" className="ml-4">
                        <Link
                          href={`/admin/championship/${id}/match/${match.id}`}
                          className="p-4 box-border"
                        >
                          <PlusIcon />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
                {/* <span>
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
                )} */}
              </Card>
            ))}
          </div>
          <Separator className="my-6" />
        </>
      ))}
    </div>
  )
}
