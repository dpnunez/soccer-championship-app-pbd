import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const referees = await prisma.referee.findMany()

  return NextResponse.json({
    data: referees,
  })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, age } = body

  const referee = await prisma.referee.create({
    data: {
      name,
      age: Number(age),
    },
  })

  return NextResponse.json({
    data: referee,
    toastInfo: {
      title: 'Árbitro criado com sucesso',
      description: `O árbitro ${referee.name} foi criado com sucesso`,
    },
  })
}
