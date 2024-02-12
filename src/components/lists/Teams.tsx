import { api } from '@/lib/api'

interface Team {
  id: number
  name: string
  emblem: string
}

export const TeamsList = async () => {
  const teams: Team[] = await api.get('/api/team')

  return (
    <div>
      <h1 className="text-2xl font-bold">Times</h1>
      {teams.map((t) => (
        <div key={t.id}>{t.name}</div>
      ))}
    </div>
  )
}
