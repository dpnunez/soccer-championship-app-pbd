import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: { username: string } },
) {
  const username = params.username
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  const teamId = user?.id_team as number

  const res = await prisma.team_championship.findMany({
    where: {
      id_team: teamId,
    },
    include: {
      championship: true,
    },
  })

  return NextResponse.json(
    {
      data: res,
    },
    {
      status: 200,
    },
  )
}
