'use client'
import { useState } from 'react'
import Nav from '../components/Nav'

const STATIONS = [
  { id: 'freedom-kano',   name: 'Freedom Radio Kano',   market: 'Kano',   frequency: '99.3 FM',  streamUrl: 'https://stream.zeno.fm/t8bhnmek8mzuv', playsToday: 0, playsWeek: 0, uptime: 99.3 },
  { id: 'freedom-kaduna', name: 'Freedom Radio Kaduna', market: 'Kaduna', frequency: '92.9 FM',  streamUrl: 'https://stream.zeno.fm/5z9v4k7e9mzuv', playsToday: 0, playsWeek: 0, uptime: 98.7 },
  { id: 'freedom-dutse',  name: 'Freedom Radio Dutse',  market: 'Dutse',  frequency: '99.5 FM',  streamUrl: 'https://stream.zeno.fm/wp75as7e9mzuv', playsToday: 0, playsWeek: 0, uptime: 97.9 },
  { id: 'dala-fm',        name: 'Dala FM Kano',         market: 'Kano',   frequency: '88.5 FM',  streamUrl: 'https://stream.zeno.fm/9zdvuszaanzuv', playsToday: 0, playsWeek: 0, uptime: 98.1 },
]

export default function Stations() {
  const [selected, setSelected] = useState<string | null>(null)
  const station = STATIONS.find(s => s.id === selected)

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <Nav />
      <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Monitored stations</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>All Freedom Radio Group stations under active monitoring</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Stations live',     value: '4 / 4' },
            { label: 'Markets covered',   value: '2' },
            { label: 'Avg uptime',        value: (STATIONS.reduce((a,s) => a + s.uptime, 0) / STATIONS.length).toFixed(1) + '%' },
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
              <div key={s.id} onClick={() => setSelected(selected === s.id ? null : s.id)}
                style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: selected === s.id ? '2px solid #028090' : '0.5px solid #E2E8F0', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0D1B3E', marginBottom: 4 }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: '#64748B' }}>{s.market} · {s.frequency}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }}></div>
                      <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>LIVE</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{s.uptime}% uptime</div>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ background: '#F1F5F9', borderRadius: 4, height: 5 }}>
                    <div style={{ width: s.uptime + '%', height: '100%', background: '#22C55E', borderRadius: 4 }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selected && station && (
            <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0', alignSelf: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#0D1B3E' }}>{station.name}</div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 20, color: '#94A3B8', cursor: 'pointer' }}>×</button>
              </div>
              {[
                ['Market', station.market],
                ['Frequency', station.frequency],
                ['Status', 'LIVE'],
                ['Stream uptime', station.uptime + '%'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #F1F5F9' }}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0D1B3E' }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
