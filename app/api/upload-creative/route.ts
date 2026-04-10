import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

function buildACRSignature(method: string, uri: string, accessKey: string, accessSecret: string, timestamp: string) {
  const str = [method, uri, accessKey, timestamp].join('\n')
  return crypto.createHmac('sha1', accessSecret).update(str).digest('base64')
}

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

    const host = process.env.ACRCLOUD_HOST!
    const accessKey = process.env.ACRCLOUD_ACCESS_KEY!
    const accessSecret = process.env.ACRCLOUD_ACCESS_SECRET!
    const bucket = process.env.ACRCLOUD_BUCKET || 'adverify-ng'
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const uri = `/v1/buckets/${bucket}/audios`
    const signature = buildACRSignature('POST', uri, accessKey, accessSecret, timestamp)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const acrForm = new FormData()
    const blob = new Blob([buffer], { type: file.type || 'audio/mp3' })
    acrForm.append('audio_file', blob, file.name)
    acrForm.append('title', title)
    acrForm.append('custom_fields', JSON.stringify({ advertiser, agency }))
    acrForm.append('access_key', accessKey)
    acrForm.append('timestamp', timestamp)
    acrForm.append('signature', signature)

    const acrRes = await fetch(`https://${host}${uri}`, {
      method: 'POST',
      body: acrForm,
    })

    const acrData = await acrRes.json()
    console.log('ACRCloud response:', JSON.stringify(acrData))

    if (!acrData?.data?.acrid) {
      return NextResponse.json({ 
        error: 'ACRCloud registration failed', 
        detail: acrData 
      }, { status: 500 })
    }

    const { error: dbError } = await supabase.from('ad_creatives').insert({
      title,
      advertiser,
      acr_id: acrData.data.acrid,
    })

    if (dbError) {
      return NextResponse.json({ error: 'DB insert failed: ' + dbError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      acrid: acrData.data.acrid,
      message: 'Ad creative registered successfully'
    })

  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
