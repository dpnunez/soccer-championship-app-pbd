import { ChampionshipList } from '@/components/lists/Championships'
import { TeamsList } from '@/components/lists/Teams'
import { api } from '@/lib/api'
import { Championship, Team } from '@/types/Entities'
import { DashboardSummary } from './Summary'

export default async function AdminDashboard() {
  const [championships, teams, players] = await Promise.all([
    api.get<Championship[]>('/api/championship'),
    api.get<Team[]>('/api/team'),
    api.get('/api/player'),
  ])

  return (
    <main>
      <DashboardSummary
        championship={championships.data.length}
        teams={teams.data.length}
        players={players.data.length}
      />
      <div className="flex gap-8 mt-6">
        <TeamsList teams={teams.data} />
        <ChampionshipList championships={championships.data} />
      </div>
    </main>
  )
}
