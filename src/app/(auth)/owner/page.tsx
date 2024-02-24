import { api } from '@/lib/api'
import { authConfig } from '@/lib/next-auth'
import { Championship } from '@/types/Entities'
import { getServerSession } from 'next-auth'
import { ChampionshipTable } from './table'

interface TeamsChampionship {
  id_championship: number
  id_team: number
  championship: Championship
}

export default async function Page() {
  const session = await getServerSession(authConfig)
  const username = session?.user.username
  const { data } = await api.get<TeamsChampionship[]>(
    `/api/championship/owner/${username}`,
  )

  return (
    <div>
      <h1 className="text-2xl font-bold my-10">Campeonatos</h1>

      <ChampionshipTable data={data} />
    </div>
  )
}
