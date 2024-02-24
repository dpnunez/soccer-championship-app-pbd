import { Team } from '@/types/Entities'
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { TeamEmblem } from '../TeamEmblem'
import Link from 'next/link'
import { PlusIcon } from '@radix-ui/react-icons'

export const TeamsList = async ({ teams }: { teams: Team[] }) => {
  return (
    <div className="flex-1">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-10">Times</h1>
        <Button asChild variant="outline">
          <Link href="/admin/team/create">
            <PlusIcon className="mr-2" />
            Criar Time
          </Link>
        </Button>
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableCell>Emblema</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">
                <TeamEmblem className="w-10" emblem={team.emblem} />
              </TableCell>
              <TableCell className="font-medium flex-1 w-full">
                <div className="flex gap-4 items-center">{team.name}</div>
              </TableCell>
              <TableCell className="font-medium">
                <Button variant="ghost">Acessar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
