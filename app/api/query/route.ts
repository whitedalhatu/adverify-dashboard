import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const advertiser = searchParams.get('advertiser')
  const market = searchParams.get('market')
  const method = searchParams.get('method')
  const station = searchParams.get('station')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let query = supabase
    .from('play_events')
    .select('*')
    .order('play_start', { ascending: false })
    .limit(200)

  if (advertiser) query = query.ilike('advertiser', `%${advertiser}%`)
  if (market) query = query.eq('market', market)
  if (method) query = query.eq('detection_method', method)
  if (station) query = query.eq('station_id', station)
  if (from) query = query.gte('play_start', from)
  if (to) query = query.lte('play_start', to)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ events: data, count: data?.length ?? 0 })
}
