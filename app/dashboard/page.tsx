import { createClient } from '@supabase/supabase-js'
import Nav from '../components/Nav'
import Link from 'next/link'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
export const revalidate = 30

export default async function Dashboard() {
  const { data: stations } = await supabase.from('stations').select('*').eq('active', true).order('name')
  const { data: recentPlays } = await supabase.from('play_events').select('*').order('play_start', { ascending: false }).limit(10)
  const today = new Date().toISOString().split('T')[0]
  const { count: playsToday } = await supabase.from('play_events').select('*', { count: 'exact', head: true }).gte('play_start', today)
  const { count: streamPlays } = await supabase.from('play_events').select('*', { count: 'exact', head: true }).gte('play_start', today).eq('detection_method', 'stream')
  const { count: rfPlays } = await supabase.from('play_events').select('*', { count: 'exact', head: true }).gte('play_start', today).eq('detection_method', 'rf')
  const { count: activeCampaigns } = await supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'active')
  const { count: missedSpots } = await supabase.from('discrepancies').select('*', { count: 'exact', head: true }).eq('status', 'open')

  const STATION_LAYERS = [
    { id: 'freedom-kano',   name: 'Freedom Radio Kano',   market: 'Kano',   frequency: '99.3 FM', rf: true  },
    { id: 'dala-fm',        name: 'Dala FM Kano',         market: 'Kano',   frequency: '88.5 FM', rf: true  },
    { id: 'freedom-dutse',  name: 'Freedom Radio Dutse',  market: 'Dutse',  frequency: '99.5 FM', rf: false },
    { id: 'freedom-kaduna', name: 'Freedom Radio Kaduna', market: 'Kaduna', frequency: '92.9 FM', rf: false },
  ]

  const statCards = [
    { label: 'Stations monitored', value: 4,                   sub: '4 active stations',         href: '/stations',  color: '#028090' },
    { label: 'Plays today',        value: playsToday ?? 0,      sub: `Stream: ${streamPlays ?? 0} · RF: ${rfPlays ?? 0}`, href: '/query',    color: '#16A34A' },
    { label: 'Active campaigns',   value: activeCampaigns ?? 0, sub: 'Across all markets',        href: '/campaigns', color: '#854F0B' },
    { label: 'Missed spots',       value: missedSpots ?? 0,     sub: 'Flagged for review',        href: '/query',     color: '#EF4444' },
  ]

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <Nav />
      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>

        {/* Clickable stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {statCards.map(card => (
            <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #E2E8F0', cursor: 'pointer', transition: 'box-shadow 0.2s', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: card.color, borderRadius: '12px 0 0 12px' }}></div>
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{card.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>{card.value}</div>
                  <div style={{ fontSize: 12, color: card.color }}>{card.sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Dual verification banner */}
        <div style={{ background: '#0D1B3E', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#028090', letterSpacing: 2, marginBottom: 6 }}>DUAL VERIFICATION SYSTEM</div>
              <div style={{ fontSize: 14, color: '#CADCFC', lineHeight: 1.6 }}>
                Every ad play confirmed by two independent sources — digital stream capture and physical FM broadcast interception.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <div style={{ background: '#028090', borderRadius: 10, padding: '10px 18px', textAlign: 'center', minWidth: 90 }}>
                <div style={{ fontSize: 10, color: '#E0F4F5', marginBottom: 3, letterSpacing: 1 }}>LAYER 1</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>Stream</div>
                <div style={{ fontSize: 10, color: '#9FE1CB', fontWeight: 600 }}>● 4 STATIONS</div>
              </div>
              <div style={{ background: '#1a3a5c', borderRadius: 10, padding: '10px 18px', textAlign: 'center', minWidth: 90, border: '1px solid #234E72' }}>
                <div style={{ fontSize: 10, color: '#7B93B8', marginBottom: 3, letterSpacing: 1 }}>LAYER 2</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#CADCFC', marginBottom: 2 }}>RF Broadcast</div>
                <div style={{ fontSize: 10, color: '#F59E0B', fontWeight: 600 }}>● 2 STATIONS</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

          {/* Station status — clickable */}
          <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: '#0D1B3E' }}>Station status</div>
              <Link href="/stations" style={{ fontSize: 13, color: '#028090', textDecoration: 'none', fontWeight: 500 }}>Manage stations →</Link>
            </div>
            {STATION_LAYERS.map(s => (
              <Link key={s.id} href="/stations" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, marginBottom: 6, cursor: 'pointer', background: '#FAFAFA', border: '0.5px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14, color: '#0D1B3E', marginBottom: 2 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{s.market} · {s.frequency}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {s.rf && (
                      <div style={{ background: '#DCFCE7', borderRadius: 6, padding: '2px 8px', fontSize: 10, color: '#16A34A', fontWeight: 700 }}>DUAL</div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E' }}></div>
                      <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 500 }}>LIVE</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent play events — clickable */}
          <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 16, color: '#0D1B3E' }}>Recent play events</div>
              <Link href="/query" style={{ fontSize: 13, color: '#028090', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
            </div>
            {!recentPlays?.length ? (
              <div style={{ color: '#94A3B8', fontSize: 14, textAlign: 'center', padding: '2rem 0' }}>
                No play events yet — upload an ad creative to begin detection.
              </div>
            ) : recentPlays.map((play, i) => (
              <Link key={i} href={`/query?advertiser=${play.advertiser || ''}`} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, marginBottom: 4, cursor: 'pointer' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, color: '#0D1B3E' }}>{play.ad_title ?? 'Unknown'}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{play.station_name} · {play.advertiser ?? '—'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ background: play.detection_method === 'rf' ? '#DCFCE7' : '#E0F4F5', color: play.detection_method === 'rf' ? '#16A34A' : '#028090', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                      {play.detection_method === 'rf' ? 'RF' : 'STREAM'}
                    </span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{new Date(play.play_start).toLocaleTimeString('en-GB')}</div>
                      <div style={{ fontSize: 10, color: '#028090', fontWeight: 500 }}>{play.confidence}% match</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Verification layer detail */}
        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0' }}>
          <div style={{ fontWeight: 600, fontSize: 16, color: '#0D1B3E', marginBottom: 16 }}>Live verification status</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {STATION_LAYERS.map(s => (
              <Link key={s.id} href="/stations" style={{ textDecoration: 'none' }}>
                <div style={{ border: '0.5px solid #E2E8F0', borderRadius: 10, padding: '1rem', background: '#FAFAFA', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0D1B3E', marginBottom: 2 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{s.market} · {s.frequency}</div>
                    </div>
                    {s.rf ? (
                      <div style={{ background: '#DCFCE7', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: '#16A34A', fontWeight: 700 }}>DUAL VERIFIED</div>
                    ) : (
                      <div style={{ background: '#F1F5F9', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: '#64748B', fontWeight: 600 }}>STREAM ONLY</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ flex: 1, background: '#E0F4F5', borderRadius: 6, padding: '5px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: '#028090', fontWeight: 600 }}>L1 Stream</span>
                      <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 700 }}>● LIVE</span>
                    </div>
                    <div style={{ flex: 1, background: s.rf ? '#DCFCE7' : '#F8FAFC', borderRadius: 6, padding: '5px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: s.rf ? 'none' : '1px dashed #E2E8F0' }}>
                      <span style={{ fontSize: 10, color: s.rf ? '#16A34A' : '#94A3B8', fontWeight: 600 }}>L2 RF</span>
                      <span style={{ fontSize: 10, color: s.rf ? '#16A34A' : '#F59E0B', fontWeight: 700 }}>{s.rf ? '● LIVE' : '● EXPANDING'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
