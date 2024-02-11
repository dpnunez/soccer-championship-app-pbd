import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hash } from 'bcrypt'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  const hashedPassword = await hash(password, 10)

  const res = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      name: 'Admin',
      type: 'admin',
    },
  })

  return NextResponse.json({ data: res, message: 'User created' })
}
