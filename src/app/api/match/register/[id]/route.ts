/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { groupBy, keyBy } from 'lodash'
interface Props {
  params: {
    id: string
  }
}

export async function GET(req: Request, props: Props) {
  const id = props.params.id
  const match = await prisma.match.findUnique({
    where: {
      id: parseInt(id),
    },
  })

  const championshipId = match?.id_championship

  const teams = await prisma.team.findMany({
    where: {
      id: {
        in: [match?.home_team as number, match?.visiting_team as number],
      },
    },
  })

  const teamsById = keyBy(teams, 'id')
  const players = await prisma.player_championship.findMany({
    include: {
      player: true,
    },
    where: {
      id_championship: championshipId,
      id_team: {
        in: [match?.home_team as number, match?.visiting_team as number],
      },
    },
  })

  const penalities = await prisma.penalties.findMany({
    where: {
      round: match?.round,
      id_championship: championshipId,
    },
  })

  const bannedIds = penalities.map((e) => e.id_player)

  const playersByTeam = groupBy(
    players
      .filter((e) => {
        return !bannedIds.includes(e.id_player)
      })
      .map(({ id_team, player }) => ({ id_team, ...player })),
    'id_team',
  )

  return NextResponse.json({
    data: {
      teams: teamsById,
      match,
      players: playersByTeam,
    },
  })
}

interface Card {
  is_red: boolean
  id_team: number
  id_player: number
}

export async function POST(req: Request, props: Props) {
  const id = props.params.id

  const body = await req.json()
  const cards = body.cards
  const goals = body.goals
  const idReferee = Number(body.id_referee)

  const match = await prisma.match.findUnique({
    where: {
      id: parseInt(id),
    },
  })

  const round = match?.round

  const isAlreadyRegistered = match?.is_registered
  if (isAlreadyRegistered) {
    return NextResponse.json({
      data: {
        ok: false,
      },
      toastInfo: {
        title: 'Partida já registrada',
        description: 'A partida já foi registrada',
      },
    })
  }

  const championshipId = match?.id_championship
  const homeId = match?.home_team
  const visitingId = match?.visiting_team

  const homeGoals = goals.filter(
    (goal: { id_team: number }) => goal.id_team === homeId,
  )

  const visitingGoals = goals.filter(
    (goal: { id_team: number }) => goal.id_team === visitingId,
  )

  await prisma.$transaction(
    cards.map((e: Card) => {
      if (e.is_red) {
        return prisma.$executeRaw`CALL AdicionarCartaoVermelho(${e.id_team}::int, ${e.id_player}::int, ${championshipId}::int, ${round}::int);`
      } else {
        return prisma.$executeRaw`CALL AtribuirCartaoAmarelo(${e.id_team}::int, ${e.id_player}::int, ${championshipId}::int, ${round}::int);`
      }
    }),
  )

  await prisma.goal.createMany({
    data: goals.map((goal: any) => ({
      ...goal,
      id_match: parseInt(id),
      id_championship: championshipId,
    })),
  })

  await prisma.match.update({
    where: {
      id: parseInt(id),
    },
    data: {
      home_goals: homeGoals.length,
      visiting_goals: visitingGoals.length,
      is_registered: true,
      id_referee: idReferee,
    },
  })

  return NextResponse.json({
    data: {
      ok: true,
    },
    toastInfo: {
      title: 'Partida registrada com sucesso',
      description: 'A partida foi registrada com sucesso',
    },
  })
}
