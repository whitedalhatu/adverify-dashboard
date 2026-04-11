'use client'
import { useState } from 'react'
import Nav from '../components/Nav'

export default function Query() {
  const [advertiser, setAdvertiser] = useState('')
  const [market, setMarket] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    setLoading(true)
    setSearched(true)
    const params = new URLSearchParams()
    if (advertiser) params.set('advertiser', advertiser)
    if (market) params.set('market', market)
    const res = await fetch('/api/query?' + params.toString())
    const data = await res.json()
    setResults(data.events || [])
    setLoading(false)
  }

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <Nav />
      <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Query play events</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>Search all detected ad plays across monitored stations</div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6, fontWeight: 500 }}>Advertiser or ad title</div>
            <input value={advertiser} onChange={e => setAdvertiser(e.target.value)}
              placeholder="e.g. Dangote, MTN, Airtel..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6, fontWeight: 500 }}>Market</div>
            <select value={market} onChange={e => setMarket(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none', background: 'white' }}>
              <option value="">All markets</option>
              <option value="Kano">Kano</option>
              <option value="Kaduna">Kaduna</option>
              <option value="Dutse">Dutse</option>
            </select>
          </div>
          <button onClick={handleSearch} disabled={loading}
            style={{ background: '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {!searched ? (
          <div style={{ background: 'white', borderRadius: 12, padding: '3rem', border: '0.5px solid #E2E8F0', textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: '#94A3B8' }}>Enter a search above to query play events from the live database.</div>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 12, border: '0.5px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '0.5px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: '#0D1B3E' }}>{results.length} play events found</span>
            </div>
            {!results.length ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>No play events found for this search.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Date / Time', 'Station', 'Market', 'Ad Creative', 'Advertiser', 'Confidence'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748B', fontWeight: 500, borderBottom: '0.5px solid #E2E8F0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '0.5px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', color: '#0D1B3E', fontFamily: 'monospace', fontSize: 12 }}>{new Date(row.play_start).toLocaleString('en-GB')}</td>
                      <td style={{ padding: '12px 16px', color: '#0D1B3E', fontWeight: 500 }}>{row.station_name}</td>
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>{row.market}</td>
                      <td style={{ padding: '12px 16px', color: '#0D1B3E' }}>{row.ad_title}</td>
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>{row.advertiser}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: '#E0F4F5', color: '#028090', padding: '3px 10px', borderRadius: 20, fontWeight: 600, fontSize: 12 }}>{row.confidence}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
