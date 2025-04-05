// app/api/reports/[id]/resolve/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { resolverId } = await req.json();
    const reportId = Number(params.id);

    if (!resolverId || isNaN(reportId)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const admin = await prisma.user.findUnique({
      where: { id: Number(resolverId) },
    });

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Invalid resolver' }, { status: 403 });
    }

    const existingReport = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!existingReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        resolved_by: existingReport.resolved_at ? null : admin.id,
        resolved_at: existingReport.resolved_at ? null : new Date(),
      },
      include: {
        submitter: { select: { name: true } },
        resolver: { select: { name: true } },
      },
    });

    return NextResponse.json({
      id: updatedReport.id.toString(),
      type: updatedReport.type,
      targetId: updatedReport.target_id.toString(),
      reason: updatedReport.reason,
      description: updatedReport.description,
      status: updatedReport.resolved_at ? 'resolved' : 'unresolved',
      createdAt: updatedReport.created_at.toISOString(),
      resolvedAt: updatedReport.resolved_at?.toISOString() || null,
      submittedBy: updatedReport.submitter
        ? { name: updatedReport.submitter.name || 'Anonymous' }
        : null,
      resolvedBy: updatedReport.resolver
        ? { name: updatedReport.resolver.name || 'Admin' }
        : null,
    });
  } catch (err) {
    console.error('[PATCH /api/reports/:id/resolve] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
