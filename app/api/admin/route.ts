import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get('id'))
  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'Invalid admin ID' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
  }

  return NextResponse.json({ name: user.name, email: user.email })
}
