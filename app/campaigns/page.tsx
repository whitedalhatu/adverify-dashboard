'use client'
import { useState } from 'react'

const CAMPAIGNS = [
  { id: 1, name: 'Dangote Cement Q2 2026', advertiser: 'Dangote Group', agency: 'SO&U', stations: ['Freedom Radio Kano', 'Dala FM Kano'], market: 'Kano', start: '2026-04-01', end: '2026-04-30', booked: 120, aired: 98, status: 'active' },
  { id: 2, name: 'MTN Data Bundle Push', advertiser: 'MTN Nigeria', agency: 'X3M Ideas', stations: ['Freedom Radio Kano', 'Freedom Radio Kaduna', 'Freedom Radio Abuja'], market: 'Multi', start: '2026-04-05', end: '2026-04-25', booked: 200, aired: 176, status: 'active' },
  { id: 3, name: 'Airtel Unlimited April', advertiser: 'Airtel Nigeria', agency: 'Insight', stations: ['Freedom Radio Abuja', 'Freedom Radio Kaduna'], market: 'Multi', start: '2026-04-01', end: '2026-04-30', booked: 90, aired: 90, status: 'active' },
  { id: 4, name: 'PZ Cussons Robb Ramadan', advertiser: 'PZ Cussons', agency: 'Noahs Ark', stations: ['Freedom Radio Kano', 'Dala FM Kano', 'Freedom Radio Dutse'], market: 'North', start: '2026-03-15', end: '2026-04-14', booked: 150, aired: 150, status: 'completed' },
  { id: 5, name: 'GTBank SME Promo', advertiser: 'GTBank', agency: 'DDB Lagos', stations: ['Freedom Radio Abuja'], market: 'Abuja', start: '2026-04-08', end: '2026-04-22', booked: 60, aired: 41, status: 'active' },
]

export default function Campaigns() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? CAMPAIGNS : CAMPAIGNS.filter(c => c.status === filter)

  function compliance(booked: number, aired: number) {
    return Math.round((aired / booked) * 100)
  }

  function complianceColor(pct: number) {
    if (pct >= 95) return '#22C55E'
    if (pct >= 80) return '#F59E0B'
    return '#EF4444'
  }

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <div style={{ background: '#0D1B3E', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>AdVerify</span>
          <span style={{ color: '#028090', fontWeight: 400, fontSize: 20 }}>Nigeria</span>
        </div>
        <nav style={{ display: 'flex', gap: 24 }}>
          {['Dashboard', 'Campaigns', 'Query'].map(item => (
            <a key={item} href={`/${item.toLowerCase()}`} style={{ color: item === 'Campaigns' ? '#028090' : '#CADCFC', textDecoration: 'none', fontSize: 14 }}>{item}</a>
          ))}
        </nav>
      </div>

      <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Campaigns</div>
            <div style={{ fontSize: 14, color: '#64748B' }}>Track booked vs. aired spots for every campaign</div>
          </div>
          <button style={{ background: '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + New campaign
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total campaigns',    value: CAMPAIGNS.length },
            { label: 'Active',             value: CAMPAIGNS.filter(c => c.status === 'active').length },
            { label: 'Total spots booked', value: CAMPAIGNS.reduce((a, c) => a + c.booked, 0) },
            { label: 'Total spots aired',  value: CAMPAIGNS.reduce((a, c) => a + c.aired, 0) },
          ].map(card => (
            <div key={card.label} style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#0D1B3E' }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['all', 'active', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '6px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                background: filter === f ? '#0D1B3E' : 'white',
                color: filter === f ? 'white' : '#64748B',
                boxShadow: filter === f ? 'none' : '0 0 0 1px #E2E8F0' }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(c => {
            const pct = compliance(c.booked, c.aired)
            const color = complianceColor(pct)
            const shortfall = c.booked - c.aired
            return (
              <div key={c.id} style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: '#0D1B3E' }}>{c.name}</span>
                      <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600,
                        background: c.status === 'active' ? '#DCFCE7' : '#F1F5F9',
                        color: c.status === 'active' ? '#16A34A' : '#64748B' }}>
                        {c.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>
                      {c.advertiser} · {c.agency} · {c.market}
                    </div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>
                      {c.start} to {c.end} · {c.stations.join(', ')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Booked</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E' }}>{c.booked}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Aired</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E' }}>{c.aired}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Compliance</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color }}>{pct}%</div>
                    </div>
                    {shortfall > 0 && (
                      <div style={{ background: '#FEF2F2', borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: '#EF4444', marginBottom: 2 }}>Shortfall</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#EF4444' }}>-{shortfall}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <div style={{ background: '#F1F5F9', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 4 }}></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
