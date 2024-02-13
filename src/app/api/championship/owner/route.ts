import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { NextApiRequest } from 'next'

export async function GET(req: NextApiRequest) {
  const url = req.url as string
  const searchParams = new URLSearchParams(url.split('?')[1])
  const username = searchParams.get('username') as string
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  const teamId = user?.id_team as number

  // get req search params
  const res = await prisma.team_championship.findMany({
    where: {
      id_team: teamId,
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
