import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/next-auth'

export async function POST(req: Request) {
  const { players, championship } = await req.json()
  const session = await getServerSession(authConfig)

  const username = session?.user.username
  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  const teamId = user?.id_team

  const backup = await prisma.player_championship.findMany({
    where: {
      id_team: teamId as number,
      id_championship: championship,
    },
  })

  // delete all players from this team in this championship
  await prisma.player_championship.deleteMany({
    where: {
      id_team: teamId as number,
      id_championship: championship,
    },
  })

  // subscribe players to championship
  try {
    await prisma.player_championship.createMany({
      data: players.map((player: number) => ({
        id_player: player,
        id_championship: championship,
        id_team: teamId,
      })),
    })
  } catch {
    // rollback
    await prisma.player_championship.createMany({
      data: backup,
    })

    return NextResponse.json(
      {
        toastInfo: {
          title:
            'Alguns jogadores selecionados já estão inscritos no campeonato',
          description:
            'Por favor, selecione outros jogadores, para mais informações, entre em contato com o administrador da plataforma.',
        },
      },
      {
        status: 500,
      },
    )
  }

  return NextResponse.json(
    {
      data: { ok: true },
      toastInfo: {
        title: 'Jogadores cadastrados com sucesso',
      },
    },
    {
      status: 201,
    },
  )
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const username = url.searchParams.get('username') as string
  const championship = url.searchParams.get('championship') as string

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  const teamId = user?.id_team

  const players = await prisma.player_championship.findMany({
    where: {
      id_team: teamId as number,
      id_championship: Number(championship),
    },
  })

  const playersIds = players.map((player) => player.id_player)

  return NextResponse.json(
    { data: playersIds },
    {
      status: 200,
    },
  )
}
