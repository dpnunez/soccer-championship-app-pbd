'use client'

import { TeamEmblem } from '@/components/TeamEmblem'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui'

interface Props {
  data: {
    emblem: string
    id: number
    name: string
    points: number
    matches: number
    wins: number
    loses: number
  }[]
}

export const ChampionshipTable = ({ data }: Props) => {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Tabela de classificação</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Pontos</TableCell>
            <TableCell>Jogos</TableCell>
            <TableCell>Vitórias</TableCell>
            <TableCell>Derrotas</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((team, i) => (
            <TableRow key={team.id}>
              <TableCell className="font-medium">{i + 1}</TableCell>
              <TableCell className="font-medium">
                <div className="flex gap-4 items-center">
                  <TeamEmblem className="w-10" emblem={team.emblem} />
                  {team.name}
                </div>
              </TableCell>
              <TableCell>{team.points}</TableCell>
              <TableCell>{team.matches}</TableCell>
              <TableCell>{team.wins}</TableCell>
              <TableCell>{team.loses}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
