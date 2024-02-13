import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'
import { hash } from 'bcrypt'

export async function POST(req: Request) {
  const { name, emblem } = await req.json()

  const { id: id_team } = await prisma.team.create({
    data: {
      name,
      emblem: emblem || null,
    },
  })

  const username = `team-${name.toLowerCase().replace(/\s/g, '-')}`
  const initialPassword = randomBytes(4).toString('hex')

  const hashedPassword = await hash(initialPassword, 10)

  const owner = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name,
      type: 'owner',
      id_team,
    },
  })

  return NextResponse.json({
    data: {
      owner: {
        username: owner?.username,
        password: initialPassword,
      },
    },
    message: 'Time criado com sucesso',
  })
}

export async function GET() {
  const teams = await prisma.team.findMany()

  return NextResponse.json(teams)
}
