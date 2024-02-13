import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  // Get jwt info team id
  const paramId = 9 // ToDo: editar

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
