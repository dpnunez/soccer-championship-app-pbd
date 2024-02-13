import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface MatchesLocal {
  home_team: number
  visiting_team: number
}

export async function POST(req: Request) {
  // ToDo: add session validation
  const { id } = await req.json()

  const teams = await prisma.team_championship.findMany({
    where: {
      id_championship: id,
    },
  })

  const team_ids = teams.map((team) => team.id_team)

  // arranjo 2 a 2  de teams_ids
  const matches: MatchesLocal[] = []
  for (let i = 0; i < team_ids.length; i++) {
    for (let j = 0; j < team_ids.length; j++) {
      if (i !== j)
        matches.push({ home_team: team_ids[i], visiting_team: team_ids[j] })
    }
  }

  return NextResponse.json(
    {
      data: {
        ok: true,
      },
      toastInfo: {
        title: 'Campeonato iniciado com sucesso',
        description: `O campeonato foi criado com sucesso! Entre em detalhes para acompanhar as futuras rodadas`,
      },
    },
    {
      status: 201,
    },
  )
}

export async function GET() {
  const teams = await prisma.championship.findMany()

  return NextResponse.json(teams)
}
