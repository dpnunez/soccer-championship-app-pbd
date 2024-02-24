import { ChampionshipStatus } from '@/components/ChampionshipStatus'
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { cn } from '@/lib/utils'
import { Championship } from '@/types/Entities'
import Link from 'next/link'

interface TeamsChampionship {
  id_championship: number
  id_team: number
  championship: Championship
}

interface Props {
  data: TeamsChampionship[]
}

export function ChampionshipTable({ data }: Props) {
  const urlAction = (id: number, status: string) => {
    switch (status) {
      case 'not_started':
        return `/owner/championship/${id}`
      case 'started':
        return `/championship/${id}`
      case 'finished':
        return `/owner/championship/${id}/matches`
      default:
        return `/owner/championship/${id}`
    }
  }

  const status = {
    not_started: 'Não iniciado',
    started: 'Iniciado',
    finished: 'Finalizado',
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Nome</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Ações</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((c) => (
          <TableRow key={c.id_championship}>
            <TableCell className="w-full">{c.championship.name}</TableCell>
            <TableCell>
              <ChampionshipStatus status={c.championship.status} />
            </TableCell>
            <TableCell>
              <Button variant="secondary">
                <Link
                  href={urlAction(c.id_championship, c.championship.status)}
                >
                  Acessar
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
