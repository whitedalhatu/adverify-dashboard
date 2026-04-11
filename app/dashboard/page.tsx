import { createClient } from '@supabase/supabase-js'
import Nav from '../components/Nav'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
export const revalidate = 30

export default async function Dashboard() {
  const { data: stations } = await supabase.from('stations').select('*').eq('active', true).order('name')
  const { data: recentPlays } = await supabase.from('play_events').select('*').order('play_start', { ascending: false }).limit(10)
  const today = new Date().toISOString().split('T')[0]
  const { count: playsToday } = await supabase.from('play_events').select('*', { count: 'exact', head: true }).gte('play_start', today)
  const { count: activeCampaigns } = await supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'active')

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <Nav />
      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Stations monitored', value: stations?.length ?? 0,  sub: '4 active stations' },
            { label: 'Plays today',         value: playsToday ?? 0,         sub: 'Detected via stream' },
            { label: 'Active campaigns',    value: activeCampaigns ?? 0,    sub: 'Across all markets' },
            { label: 'Missed spots',        value: 0,                       sub: 'Flagged for review' },
          ].map(card => (
            <div key={card.label} style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>{card.value}</div>
              <div style={{ fontSize: 12, color: '#028090' }}>{card.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0' }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#0D1B3E', marginBottom: 16 }}>Station status</div>
            {stations?.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: '#0D1B3E' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{s.market} · {s.frequency}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }}></div>
                  <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 500 }}>LIVE</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0' }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#0D1B3E', marginBottom: 16 }}>Recent play events</div>
            {!recentPlays?.length ? (
              <div style={{ color: '#94A3B8', fontSize: 14, textAlign: 'center', padding: '2rem 0' }}>
                No play events yet — upload an ad creative to begin detection.
              </div>
            ) : recentPlays.map((play, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13, color: '#0D1B3E' }}>{play.ad_title ?? 'Unknown'}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{play.station_name} · {play.advertiser ?? '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{new Date(play.play_start).toLocaleTimeString('en-GB')}</div>
                  <div style={{ fontSize: 11, color: '#028090', fontWeight: 500 }}>{play.confidence}% match</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
