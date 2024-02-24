import { CreateChampionshipForm } from '@/components/forms/CreateChampionship'
import { api } from '@/lib/api'

interface Team {
  name: string
  emblem: string
  id: number
}

export default async function CreateChampionship() {
  const teams = await api.get<Team[]>('/api/team')

  return <CreateChampionshipForm teams={teams.data} />
}
