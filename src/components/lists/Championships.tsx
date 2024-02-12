import { api } from '@/lib/api'

interface Championship {
  id: number
  name: string
  status: 'not_started' | 'started' | 'finished'
}

export const ChampionshipList = async () => {
  const championships: Championship[] = await api.get('/api/championship')

  return (
    <div>
      <h1 className="text-2xl font-bold">Campeonatos</h1>
      {championships.map((t) => (
        <div key={t.id}>
          {t.name} - {t.status}
        </div>
      ))}
    </div>
  )
}
