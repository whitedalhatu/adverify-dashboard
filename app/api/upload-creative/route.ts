import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const FINGERPRINT_SERVER = process.env.FINGERPRINT_SERVER_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    const advertiser = formData.get('advertiser') as string
    const agency = (formData.get('agency') as string) || ''

    if (!file || !title || !advertiser) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Forward to fingerprint server
    const upstream = new FormData()
    const bytes = await file.arrayBuffer()
    const blob = new Blob([bytes], { type: file.type || 'audio/mp3' })
    upstream.append('file', blob, file.name)
    upstream.append('title', title)
    upstream.append('advertiser', advertiser)
    upstream.append('agency', agency)

    const res = await fetch(`${FINGERPRINT_SERVER}/upload`, {
      method: 'POST',
      body: upstream,
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      return NextResponse.json({ error: data.error || 'Upload failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      acrid: data.acrid,
      title: data.title,
      advertiser: data.advertiser,
      duration: data.duration,
      message: data.message,
    })

  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const res = await fetch(`${FINGERPRINT_SERVER}/creatives`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([])
  }
}
