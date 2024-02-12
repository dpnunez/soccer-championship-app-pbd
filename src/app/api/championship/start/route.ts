import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  // ToDo: add session validation
  const { id } = await req.json()

  const res = await prisma.championship.update({
    where: {
      id,
    },
    data: {
      status: 'started',
    },
  })

  // ToDo: gerar rodadas
  // Transform alguns campos do banco opcionais (para antes do cadastro da partida)

  return NextResponse.json(
    {
      data: {
        ...res,
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
