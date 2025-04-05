import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { email, name } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })

  // Prevent user creation if this email belongs to an admin
  if (existingUser && existingUser.role === 'admin') {
    return NextResponse.json(
      { error: 'This email belongs to an admin account.' },
      { status: 403 }
    )
  }

  // If user exists and is a regular user, update name if needed
  if (existingUser && existingUser.role === 'user') {
    if (!existingUser.name && name) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { name },
      })
      return NextResponse.json({ user: updatedUser })
    }
    return NextResponse.json({ user: existingUser })
  }

  // Create a new user
  const newUser = await prisma.user.create({
    data: {
      email,
      name: name || null,
      role: 'user',
    },
  })

  return NextResponse.json({ user: newUser }, { status: 201 })
}
