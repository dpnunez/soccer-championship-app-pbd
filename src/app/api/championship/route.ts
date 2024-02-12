import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  // ToDo: add session validation
  const { name, teams } = await req.json()

  if (teams.length < 3) {
    return NextResponse.json(
      {
        toastInfo: {
          title: 'Quantidade de times insuficiente',
        },
      },
      {
        status: 401,
      },
    )
  }

  const res = await prisma.championship.create({
    data: {
      name,
      status: 'not_started',
    },
  })
  const championshipId = res.id

  const teamsRes = await prisma.team_championship.createMany({
    data: teams.map((teamId: number) => ({
      id_team: teamId,
      id_championship: championshipId,
    })),
  })

  console.log('teamres', teamsRes)

  return NextResponse.json({
    data: {
      ...res,
    },
    toastInfo: {
      title: 'Campeonato criado com sucesso',
      description: `O campeonato ${name} foi criado com sucesso!`,
    },
  })
}

export async function GET() {
  const teams = await prisma.championship.findMany()

  return NextResponse.json(teams)
}
