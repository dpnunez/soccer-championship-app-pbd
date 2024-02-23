import { ChampionshipList } from '@/components/lists/Championships'
import { TeamsList } from '@/components/lists/Teams'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <main>
      <Link href="/admin/team/create">Criar time</Link>
      <Link href="/admin/championship/create">Criar campeonato</Link>

      <TeamsList />
      <ChampionshipList />

      <TeamsList />
      <ChampionshipList />
      <TeamsList />
      <ChampionshipList />
      <TeamsList />
      <ChampionshipList />
      <TeamsList />
      <ChampionshipList />
    </main>
  )
}
