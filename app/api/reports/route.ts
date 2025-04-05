import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, target_id, reason, description, submitted_by } = body

    if (!type || !target_id || !reason || !submitted_by) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const submittedById = Number(submitted_by)
    const targetId = Number(target_id)

    if (isNaN(submittedById) || isNaN(targetId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const userExists = await prisma.user.findUnique({
      where: { id: submittedById },
    })

    if (!userExists) {
      return NextResponse.json({ error: 'Invalid submitted_by user ID' }, { status: 400 })
    }

    const report = await prisma.report.create({
      data: {
        type,
        target_id: targetId,
        reason,
        description: description || null,
        submitted_by: submittedById,
      },
    })

    return NextResponse.json(report, { status: 201 })
  } catch (err) {
    console.error('[POST /api/reports] Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const reports = await prisma.report.findMany({
        include: {
          submitter: { select: { name: true, email: true } },
          resolver: { select: { name: true, email: true } },
        },
        orderBy: { created_at: 'desc' },
      })
      
      const formatted = reports.map((r) => ({
        id: r.id.toString(),
        type: r.type,
        targetId: r.target_id.toString(),
        reason: r.reason,
        description: r.description,
        status: r.resolved_at ? 'resolved' : 'unresolved',
        createdAt: r.created_at.toISOString(),
        resolvedAt: r.resolved_at?.toISOString() || null,
        submittedBy: r.submitter ? { name: r.submitter.name, email: r.submitter.email } : null,
        resolvedBy: r.resolver ? { name: r.resolver.name, email: r.resolver.email } : null,
      }))

    return NextResponse.json(formatted)
  } catch (err) {
    console.error('[GET /api/reports] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}
