import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sortBy } from 'lodash'

interface Props {
  params: {
    id: string
  }
}

export async function GET(req: Request, props: Props) {
  const championshipId = props.params.id

  const teamsChampionship = await prisma.team_championship.findMany({
    where: {
      id_championship: parseInt(championshipId),
    },
    include: {
      team: true,
    },
  })

  const matches = await prisma.match.findMany({
    where: {
      id_championship: parseInt(championshipId),
    },
  })

  const matchesRegistered = matches.filter((match) => match.is_registered)

  const teams = teamsChampionship.map((team) => team.team)

  const table = teams.map((team) => {
    const matches = matchesRegistered.filter(
      (match) => match.home_team === team.id || match.visiting_team === team.id,
    )

    const wins = matches.filter((match) => {
      if (match.home_team === team.id) {
        return (match.home_goals as number) > (match.visiting_goals as number)
      } else {
        return (match.visiting_goals as number) > (match.home_goals as number)
      }
    }).length

    const draws = matches.filter(
      (match) => match.home_goals === match.visiting_goals,
    ).length

    return {
      id: team.id,
      name: team.name,
      emblem: team.emblem,
      points: wins * 3 + draws,
      matches: matches.length,
      wins,
      loses: matches.length - wins - draws,
    }
  })

  return NextResponse.json({
    data: {
      table: sortBy(table, ['points', 'wins', 'loses', 'name']).reverse(),
    },
  })
}
