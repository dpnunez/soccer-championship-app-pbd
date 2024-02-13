import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const paramId = Number(req.url.split('/').pop())

  const res = await prisma.championship.findFirst({
    where: {
      id: paramId, // EDIT
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
