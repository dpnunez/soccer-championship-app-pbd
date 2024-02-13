import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const { name, age, origin, dominantLeg } = await req.json()

  const player = await prisma.player.create({
    data: {
      name,
      age: Number(age || 18),
      origin,
      dominant_leg: dominantLeg,
    },
  })

  return NextResponse.json(
    {
      data: { ok: true },
      toastInfo: {
        title: 'Jogador criado com sucesso',
        description: `Jogador ${player.name} criado com sucesso`,
      },
    },
    {
      status: 201,
    },
  )
}
