import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const players = await prisma.player.findMany()

  return NextResponse.json({
    data: players,
  })
}
