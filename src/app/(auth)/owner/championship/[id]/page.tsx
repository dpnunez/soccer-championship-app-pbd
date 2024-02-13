import { PlayersForm } from '@/components/forms/PlayersForm'
import { api } from '@/lib/api'

interface Props {
  params: {
    id: string
  }
}

// ToDo: find interface
export default async function Page({ params }: Props) {
  const { data } = await api.get(`/api/championship/owner/${params.id}`)

  return (
    <div>
      {data.name}

      <PlayersForm />
    </div>
  )
}
