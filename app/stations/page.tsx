'use client'
import { useState } from 'react'

const STATIONS = [
  {
    id: 'freedom-kano',
    name: 'Freedom Radio Kano',
    market: 'Kano',
    frequency: '99.3 FM',
    streamUrl: 'https://stream.freedomradiokano.com/live',
    status: 'live',
    playsToday: 84,
    playsWeek: 521,
    lastPlay: '11:42:03',
    lastAd: 'Dangote Cement 30s',
    uptime: 99.8,
  },
  {
    id: 'freedom-kaduna',
    name: 'Freedom Radio Kaduna',
    market: 'Kaduna',
    frequency: '90.5 FM',
    streamUrl: 'https://stream.freedomradiokaduna.com/live',
    status: 'live',
    playsToday: 71,
    playsWeek: 448,
    lastPlay: '11:38:51',
    lastAd: 'MTN Data Bundle 45s',
    uptime: 99.2,
  },
  {
    id: 'freedom-dutse',
    name: 'Freedom Radio Dutse',
    market: 'Dutse',
    frequency: '89.5 FM',
    streamUrl: 'https://stream.freedomradiodutse.com/live',
    status: 'live',
    playsToday: 38,
    playsWeek: 276,
    lastPlay: '11:27:44',
    lastAd: 'Indomie Jingle 20s',
    uptime: 98.6,
  },
  {
    id: 'freedom-abuja',
    name: 'Freedom Radio Abuja',
    market: 'Abuja',
    frequency: '95.1 FM',
    streamUrl: 'https://stream.freedomradioabuja.com/live',
    status: 'live',
    playsToday: 62,
    playsWeek: 389,
    lastPlay: '11:30:09',
    lastAd: 'Airtel Unlimited 60s',
    uptime: 99.5,
  },
  {
    id: 'dala-fm',
    name: 'Dala FM Kano',
    market: 'Kano',
    frequency: '101.5 FM',
    streamUrl: 'https://stream.dalafm.com/live',
    status: 'live',
    playsToday: 29,
    playsWeek: 198,
    lastPlay: '11:35:22',
    lastAd: 'PZ Cussons Robb 30s',
    uptime: 97.9,
  },
]

export default function Stations() {
  const [selected, setSelected] = useState<string | null>(null)

  const station = STATIONS.find(s => s.id === selected)

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <div style={{ background: '#0D1B3E', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>AdVerify</span>
          <span style={{ color: '#028090', fontWeight: 400, fontSize: 20 }}>Nigeria</span>
        </div>
        <nav style={{ display: 'flex', gap: 24 }}>
          {['Dashboard', 'Campaigns', 'Query', 'Stations'].map(item => (
            <a key={item} href={`/${item.toLowerCase()}`}
              style={{ color: item === 'Stations' ? '#028090' : '#CADCFC', textDecoration: 'none', fontSize: 14 }}>
              {item}
            </a>
          ))}
        </nav>
      </div>

      <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Monitored stations</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>All Freedom Radio Group stations currently under active monitoring</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Stations live',    value: STATIONS.filter(s => s.status === 'live').length + ' / ' + STATIONS.length },
            { label: 'Total plays today', value: STATIONS.reduce((a, s) => a + s.playsToday, 0) },
            { label: 'Avg uptime',        value: (STATIONS.reduce((a, s) => a + s.uptime, 0) / STATIONS.length).toFixed(1) + '%' },
          ].map(card => (
            <div key={card.label} style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#0D1B3E' }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STATIONS.map(s => (
              <div key={s.id}
                onClick={() => setSelected(selected === s.id ? null : s.id)}
                style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: selected === s.id ? '2px solid #028090' : '0.5px solid #E2E8F0', cursor: 'pointer', transition: 'border 0.15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0D1B3E', marginBottom: 4 }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{s.market} · {s.frequency}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>Last play: {s.lastPlay} · {s.lastAd}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }}></div>
                      <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>LIVE</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{s.playsToday} plays today</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{s.uptime}% uptime</div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>Stream uptime</span>
                    <span style={{ fontSize: 11, color: '#028090', fontWeight: 600 }}>{s.uptime}%</span>
                  </div>
                  <div style={{ background: '#F1F5F9', borderRadius: 4, height: 5 }}>
                    <div style={{ width: `${s.uptime}%`, height: '100%', background: s.uptime > 99 ? '#22C55E' : s.uptime > 98 ? '#F59E0B' : '#EF4444', borderRadius: 4 }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selected && station && (
            <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0', alignSelf: 'flex-start', position: 'sticky', top: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#0D1B3E' }}>{station.name}</div>
                <button onClick={() => setSelected(null)}
                  style={{ background: 'none', border: 'none', fontSize: 18, color: '#94A3B8', cursor: 'pointer' }}>
                  x
                </button>
              </div>

              {[
                { label: 'Market',       value: station.market },
                { label: 'Frequency',    value: station.frequency },
                { label: 'Stream URL',   value: station.streamUrl },
                { label: 'Status',       value: 'LIVE' },
                { label: 'Plays today',  value: station.playsToday },
                { label: 'Plays this week', value: station.playsWeek },
                { label: 'Last ad detected', value: station.lastAd },
                { label: 'Last play time',   value: station.lastPlay },
                { label: 'Stream uptime',    value: station.uptime + '%' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #F1F5F9' }}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0D1B3E', maxWidth: 200, textAlign: 'right', wordBreak: 'break-all' }}>{row.value}</span>
                </div>
              ))}

              <button style={{ marginTop: 20, width: '100%', background: '#E0F4F5', color: '#028090', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                View all plays from this station
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
