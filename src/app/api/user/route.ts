import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const userByUsername = await prisma.user.findUnique({
    where: { username },
  })

  if (userByUsername?.password !== password) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 },
    )
  }

  const isAdmin = userByUsername?.type === 'admin'

  return NextResponse.json({ ...userByUsername, isAdmin })
}
