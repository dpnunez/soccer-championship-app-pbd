import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type Match = [home: number, visiting: number, round: number]

function generateGames(teams: number[]) {
  const rounds = []
  const half = teams.length / 2
  const fixedRound = teams.slice(0, half).reverse()
  const invertedRound = teams.slice(half)

  for (let i = 0; i < teams.length - 1; i++) {
    const jogos = []
    for (let j = 0; j < half; j++) {
      if (fixedRound[j] && invertedRound[j]) {
        jogos.push([fixedRound[j], invertedRound[j]])
      }
    }
    rounds.push(jogos)

    invertedRound.push(fixedRound.pop() as number)
    fixedRound.splice(1, 0, invertedRound.shift() as number)
  }

  return rounds
}

export async function POST(req: Request) {
  // ToDo: add session validation
  const { id } = await req.json()

  const teams = await prisma.team_championship.findMany({
    select: {
      id_team: true,
    },
    where: {
      id_championship: id,
    },
  })

  const teamsId = teams.map((team) => team.id_team)

  if (teamsId.length % 2) {
    return NextResponse.json(
      {
        data: {
          ok: false,
        },
        toastInfo: {
          title: 'Erro ao iniciar campeonato',
          description: `O campeonato não pode ser iniciado com um número ímpar de times`,
        },
      },
      {
        status: 400,
      },
    )
  }

  const firstTurn = generateGames(teamsId).flatMap((e, i) => {
    return e.map((e) => [...e, i + 1])
  })

  const offsetRodada = firstTurn[firstTurn.length - 1][2]

  const secondTurn = firstTurn.map((partida) => {
    const mandante = partida[1]
    const visitante = partida[0]
    const rodada = offsetRodada + partida[2]

    return [mandante, visitante, rodada]
  })

  const matchs: Match[] = [...firstTurn, ...secondTurn] as Match[]

  await prisma.match.createMany({
    data: matchs.map((match) => {
      return {
        id_championship: id,
        home_team: match[0],
        visiting_team: match[1],
        round: match[2],
      }
    }),
  })

  await prisma.championship.update({
    where: {
      id,
    },
    data: {
      status: 'started',
    },
  })

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
