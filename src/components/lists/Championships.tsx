import { Championship } from '@/types/Entities'
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui'
import Link from 'next/link'
import {
  DotsHorizontalIcon,
  EyeOpenIcon,
  PlayIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { ChampionshipStatus } from '../ChampionshipStatus'

const statusToText = {
  not_started: 'Não Iniciado',
  started: 'Iniciado',
  finished: 'Finalizado',
}

export const ChampionshipList = async ({
  championships,
}: {
  championships: Championship[]
}) => {
  return (
    <div className="flex-1">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-10">Times</h1>
        <Button asChild variant="outline">
          <Link href="/admin/team/create">
            <PlusIcon className="mr-2" />
            Criar Campeonato
          </Link>
        </Button>
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {championships.map((ch) => (
            <TableRow key={ch.id}>
              <TableCell className="font-medium">
                <div>{ch.id}</div>
              </TableCell>
              <TableCell className="font-medium flex-1 w-full">
                <div className="flex gap-4 items-center">{ch.name}</div>
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <ChampionshipStatus status={ch.status} />
                </div>
              </TableCell>
              <TableCell className="font-medium" align="center">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <DotsHorizontalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled={ch.status !== 'not_started'}>
                      <PlayIcon className="mr-4" />
                      Iniciar campeonato
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/championship/${ch.id}`}>
                        <EyeOpenIcon className="mr-4" />
                        Visualizar
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
