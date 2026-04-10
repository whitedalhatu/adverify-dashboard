'use client'
import { useState } from 'react'

const DEMO_DATA = [
  { time: '2026-04-10 11:42:03', station: 'Freedom Radio Kano',   market: 'Kano',   ad: 'Dangote Cement 30s',    advertiser: 'Dangote Group',   duration: '30s', confidence: 97 },
  { time: '2026-04-10 11:38:51', station: 'Freedom Radio Kaduna', market: 'Kaduna', ad: 'MTN Data Bundle 45s',   advertiser: 'MTN Nigeria',     duration: '45s', confidence: 94 },
  { time: '2026-04-10 11:35:22', station: 'Dala FM Kano',         market: 'Kano',   ad: 'PZ Cussons Robb 30s',  advertiser: 'PZ Cussons',      duration: '30s', confidence: 99 },
  { time: '2026-04-10 11:30:09', station: 'Freedom Radio Abuja',  market: 'Abuja',  ad: 'Airtel Unlimited 60s',  advertiser: 'Airtel Nigeria',  duration: '60s', confidence: 96 },
  { time: '2026-04-10 11:27:44', station: 'Freedom Radio Dutse',  market: 'Dutse',  ad: 'Indomie Jingle 20s',   advertiser: 'De-United Foods', duration: '20s', confidence: 98 },
  { time: '2026-04-10 10:55:12', station: 'Freedom Radio Kano',   market: 'Kano',   ad: 'Dangote Cement 30s',   advertiser: 'Dangote Group',   duration: '30s', confidence: 95 },
  { time: '2026-04-10 10:42:07', station: 'Freedom Radio Kaduna', market: 'Kaduna', ad: 'GTBank Promo 30s',     advertiser: 'GTBank',          duration: '30s', confidence: 93 },
  { time: '2026-04-10 10:30:55', station: 'Dala FM Kano',         market: 'Kano',   ad: 'MTN Data Bundle 45s',  advertiser: 'MTN Nigeria',     duration: '45s', confidence: 97 },
]

export default function Query() {
  const [advertiser, setAdvertiser] = useState('')
  const [market, setMarket] = useState('')
  const [results, setResults] = useState(DEMO_DATA)

  function handleSearch() {
    let filtered = DEMO_DATA
    if (advertiser) filtered = filtered.filter(r =>
      r.advertiser.toLowerCase().includes(advertiser.toLowerCase()) ||
      r.ad.toLowerCase().includes(advertiser.toLowerCase())
    )
    if (market) filtered = filtered.filter(r => r.market === market)
    setResults(filtered)
  }

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <div style={{ background: '#0D1B3E', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>AdVerify</span>
          <span style={{ color: '#028090', fontWeight: 400, fontSize: 20 }}>Nigeria</span>
        </div>
        <nav style={{ display: 'flex', gap: 24 }}>
          {['Dashboard', 'Campaigns', 'Query', 'Stations'].map(item => (
            <a key={item} href={item === 'Dashboard' ? '/dashboard' : item === 'Campaigns' ? '/campaigns' : '/query'} style={{ color: item === 'Query' ? '#028090' : '#CADCFC', textDecoration: 'none', fontSize: 14 }}>{item}</a>
          ))}
        </nav>
      </div>

      <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Query play events</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>Search all detected ad plays across monitored stations</div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6, fontWeight: 500 }}>Advertiser or ad title</div>
            <input
              value={advertiser}
              onChange={e => setAdvertiser(e.target.value)}
              placeholder="e.g. Dangote, MTN, Airtel..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6, fontWeight: 500 }}>Market</div>
            <select
              value={market}
              onChange={e => setMarket(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none', background: 'white' }}>
              <option value="">All markets</option>
              <option value="Kano">Kano</option>
              <option value="Kaduna">Kaduna</option>
              <option value="Dutse">Dutse</option>
              <option value="Abuja">Abuja</option>
            </select>
          </div>
          <button
            onClick={handleSearch}
            style={{ background: '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Search
          </button>
        </div>

        <div style={{ background: 'white', borderRadius: 12, border: '0.5px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '0.5px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#0D1B3E' }}>{results.length} play events found</span>
            <button style={{ background: '#E0F4F5', color: '#028090', border: 'none', borderRadius: 6, padding: '6px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              Export PDF
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Date / Time', 'Station', 'Market', 'Ad Creative', 'Advertiser', 'Duration', 'Confidence'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748B', fontWeight: 500, borderBottom: '0.5px solid #E2E8F0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i} style={{ borderBottom: '0.5px solid #F1F5F9' }}>
                  <td style={{ padding: '12px 16px', color: '#0D1B3E', fontFamily: 'monospace', fontSize: 12 }}>{row.time}</td>
                  <td style={{ padding: '12px 16px', color: '#0D1B3E', fontWeight: 500 }}>{row.station}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>{row.market}</td>
                  <td style={{ padding: '12px 16px', color: '#0D1B3E' }}>{row.ad}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>{row.advertiser}</td>
                  <td style={{ padding: '12px 16px', color: '#64748B' }}>{row.duration}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#E0F4F5', color: '#028090', padding: '3px 10px', borderRadius: 20, fontWeight: 600, fontSize: 12 }}>{row.confidence}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
