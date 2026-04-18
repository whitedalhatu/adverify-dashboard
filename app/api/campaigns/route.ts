import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        name:            body.name,
        advertiser:      body.advertiser,
        agency:          body.agency || null,
        flight_start:    body.flight_start,
        flight_end:      body.flight_end,
        booked_spots:    body.booked_spots,
        booked_stations: body.booked_stations,
        status:          'active',
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // For each campaign, calculate aired spots from play_events
  const enriched = await Promise.all((campaigns || []).map(async (c) => {
    const { count } = await supabase
      .from('play_events')
      .select('*', { count: 'exact', head: true })
      .ilike('advertiser', `%${c.advertiser}%`)
      .gte('play_start', c.flight_start)
      .lte('play_start', c.flight_end + 'T23:59:59')

    return {
      ...c,
      aired_spots: count ?? 0,
      compliance: c.booked_spots > 0 ? Math.round(((count ?? 0) / c.booked_spots) * 100) : 0,
      shortfall: Math.max(0, c.booked_spots - (count ?? 0)),
    }
  }))

  return NextResponse.json(enriched)
}
