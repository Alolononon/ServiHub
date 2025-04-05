'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Report = {
  id: string
  type: string
  targetId: string
  reason: string
  description?: string
  status: string
  createdAt: string
  resolvedAt?: string | null
  submittedBy?: { name: string | null; email: string } | null
  resolvedBy?: { name: string | null; email: string } | null
}

export default function AdminDashboardPage() {
  const [adminInfo, setAdminInfo] = useState<{ name: string; email: string } | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [filtered, setFiltered] = useState<Report[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    const adminId = localStorage.getItem('adminId')
    if (adminId) {
      fetch(`/api/admin?id=${adminId}`)
        .then(res => res.json())
        .then(data => {
          if (data.name && data.email) {
            setAdminInfo({ name: data.name, email: data.email })
          }
        })
    }
  }, [])

  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        setReports(data)
        setFiltered(data)
      })
  }, [])

  useEffect(() => {
    let r = [...reports]
    if (statusFilter !== 'all') r = r.filter(rep => rep.status === statusFilter)
    if (typeFilter !== 'all') r = r.filter(rep => rep.type === typeFilter)
    setFiltered(r)
  }, [statusFilter, typeFilter, reports])

  const toggleResolve = async (id: string, currentStatus: string) => {
    const resolverId = localStorage.getItem("adminId")
    const res = await fetch(`/api/reports/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolverId }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (res.ok) {
      const updated = await res.json()
      setReports(prev => prev.map(r => (r.id === id ? updated : r)))
    }
  }

  const formatDate = (iso: string | null | undefined) =>
    iso ? new Date(iso).toLocaleString() : '-'

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Report Dashboard</h1>
        {adminInfo && (
          <div className="text-right text-sm text-gray-600">
            <div className="font-semibold">{adminInfo.name}</div>
            <div className="text-xs italic">{adminInfo.email}</div>
          </div>
        )}
      </div>

      <Card className="mb-4">
        <CardContent className="flex gap-4 p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All Status</option>
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All Types</option>
            <option value="user">User</option>
            <option value="review">Review</option>
            <option value="service">Service</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Target ID</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Resolved By</TableHead>
                <TableHead>Resolved At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.targetId}</TableCell>
                  <TableCell>{report.reason}</TableCell>
                  <TableCell className="align-top">
                    <div className="bg-gray-100 text-sm p-2 rounded-md max-w-xs whitespace-pre-wrap break-words">
                      {report.description || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'resolved' ? 'default' : 'destructive'}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {report.submittedBy?.name || 'Unknown'}
                    <br />
                    <small className="text-xs text-gray-500">{report.submittedBy?.email}</small>
                  </TableCell>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell>
                    {report.resolvedBy?.name || '-'}
                    <br />
                    <small className="text-xs text-gray-500">{report.resolvedBy?.email || ''}</small>
                  </TableCell>
                  <TableCell>{formatDate(report.resolvedAt)}</TableCell>
                  <TableCell>
                    <Button onClick={() => toggleResolve(report.id, report.status)} size="sm">
                      {report.status === 'unresolved' ? 'Resolve' : 'Unresolve'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
