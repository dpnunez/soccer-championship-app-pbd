import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { compare } from 'bcrypt'

export async function POST(req: Request) {
  const { username, password } = await req.json()
  const userByUsername = await prisma.user.findUnique({
    where: { username },
  })

  if (!userByUsername) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 },
    )
  }

  const matchPasword = await compare(password, userByUsername.password)

  if (!matchPasword) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 },
    )
  }

  return NextResponse.json({ user: userByUsername })
}
