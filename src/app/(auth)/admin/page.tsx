import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <main>
      <Link href="/admin/team/create">Criar time</Link>
      <Link href="/admin/championship/create">Criar campeonato</Link>
    </main>
  )
}
