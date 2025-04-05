'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { toast } from 'sonner'

export default function SubmitPage() {
  const [type, setType] = useState('')
  const [targetId, setTargetId] = useState('')
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const userId = localStorage.getItem("userId")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!type || !targetId || !reason) {
      toast.error('Please fill in all required fields.')
      return
    }

    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        target_id: Number(targetId),
        reason,
        description,
        submitted_by: Number(userId),
      }),
    })

    if (res.ok) {
      toast.success('✅ Report submitted successfully!')
      setSubmitted(true)
      setType('')
      setTargetId('')
      setReason('')
      setDescription('')
    } else {
      toast.error('❌ Failed to submit report.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-xl p-6 shadow-xl">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4 text-center">Submit Report</h1>

          {submitted ? (
            <div className="text-green-600 text-lg font-medium text-center">
              ✅ Your report has been submitted!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Report Type</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Target ID</label>
                <Input
                  type="number"
                  placeholder="e.g. 12345"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Reason</label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="abuse">Abuse</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="misleading">Misleading</SelectItem>
                    <SelectItem value="inappropriate">Inappropriate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Description (optional)</label>
                <Textarea
                  placeholder="Describe the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Report
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
