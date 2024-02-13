import { api } from '@/lib/api'
import { authConfig } from '@/lib/next-auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'

interface TeamsChampionship {
  id_championship: number
  id_team: number
}

export default async function Page() {
  const session = await getServerSession(authConfig)
  const username = session?.user.username
  const { data } = await api.get<TeamsChampionship[]>(
    `/api/championship/owner?username=${username}`,
  )

  return (
    <div>
      <h1>Campeonatos</h1>
      {data.map((c) => (
        <Link
          href={`/owner/championship/${c.id_championship}`}
          key={c.id_championship}
        >
          <div className="text-blue-500 hover:underline">
            Acessar campeonato {c.id_championship}
          </div>
        </Link>
      ))}
    </div>
  )
}
