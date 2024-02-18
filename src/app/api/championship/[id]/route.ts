import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import _ from 'lodash'

interface Parameters {
  params: {
    id: string
  }
}

export async function GET(req: Request, { params }: Parameters) {
  const championship = await prisma.championship.findUnique({
    where: {
      id: Number(params.id),
    },
  })

  if (!championship) {
    return NextResponse.json(
      {
        toastInfo: {
          title: 'Campeonato não encontrado',
        },
      },
      {
        status: 404,
      },
    )
  }
  const matches = await prisma.match.findMany({
    where: {
      id_championship: Number(params.id),
    },
  })

  const teams = await prisma.team_championship.findMany({
    include: {
      team: true,
    },
    where: {
      id_championship: Number(params.id),
    },
  })

  const teamsById = _.keyBy(teams, 'id_team')

  return NextResponse.json({
    data: {
      rounds: _.groupBy(matches, 'round'),
      teams: teamsById,
    },
  })
}
