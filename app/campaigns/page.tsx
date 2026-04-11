'use client'
import { useState } from 'react'
import Nav from '../components/Nav'

const STATION_OPTIONS = [
  'Freedom Radio Kano',
  'Freedom Radio Kaduna', 
  'Freedom Radio Dutse',
  'Dala FM Kano',
]

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', advertiser: '', agency: '',
    flight_start: '', flight_end: '',
    booked_spots: '', stations: [] as string[],
  })

  const filtered = filter === 'all' ? campaigns : campaigns.filter(c => c.status === filter)

  function set(field: string, value: any) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function toggleStation(s: string) {
    setForm(f => ({
      ...f,
      stations: f.stations.includes(s) ? f.stations.filter(x => x !== s) : [...f.stations, s]
    }))
  }

  async function handleSave() {
    if (!form.name || !form.advertiser || !form.flight_start || !form.flight_end || !form.booked_spots || form.stations.length === 0) {
      alert('Please fill in all required fields and select at least one station.')
      return
    }
    setSaving(true)
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        advertiser: form.advertiser,
        agency: form.agency,
        flight_start: form.flight_start,
        flight_end: form.flight_end,
        booked_spots: parseInt(form.booked_spots),
        booked_stations: form.stations,
        status: 'active',
      })
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setCampaigns(c => [{
        ...data,
        aired: 0,
        booked: parseInt(form.booked_spots),
        stations: form.stations,
        start: form.flight_start,
        end: form.flight_end,
      }, ...c])
      setShowModal(false)
      setForm({ name:'', advertiser:'', agency:'', flight_start:'', flight_end:'', booked_spots:'', stations:[] })
    } else {
      alert('Error saving campaign: ' + (data.error || 'Unknown error'))
    }
  }

  function compliance(booked: number, aired: number) { return booked === 0 ? 0 : Math.round((aired / booked) * 100) }
  function complianceColor(pct: number) { return pct >= 95 ? '#22C55E' : pct >= 80 ? '#F59E0B' : '#EF4444' }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid #E2E8F0', fontSize: 14, outline: 'none',
    boxSizing: 'border-box' as const, fontFamily: 'system-ui',
  }
  const labelStyle = { fontSize: 13, fontWeight: 500 as const, color: '#0D1B3E', display: 'block' as const, marginBottom: 6 }

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <Nav />

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0D1B3E' }}>New campaign</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: '#94A3B8', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Campaign name <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Dangote Cement Q2 2026" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Advertiser <span style={{ color: '#EF4444' }}>*</span></label>
                  <input value={form.advertiser} onChange={e => set('advertiser', e.target.value)} placeholder="e.g. Dangote Group" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Agency <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span></label>
                  <input value={form.agency} onChange={e => set('agency', e.target.value)} placeholder="e.g. SO&U" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Flight start <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="date" value={form.flight_start} onChange={e => set('flight_start', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Flight end <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="date" value={form.flight_end} onChange={e => set('flight_end', e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Total spots booked <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="number" value={form.booked_spots} onChange={e => set('booked_spots', e.target.value)} placeholder="e.g. 120" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Stations <span style={{ color: '#EF4444' }}>*</span></label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {STATION_OPTIONS.map(s => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, border: form.stations.includes(s) ? '1px solid #028090' : '1px solid #E2E8F0', background: form.stations.includes(s) ? '#E0F4F5' : 'white' }}>
                      <input type="checkbox" checked={form.stations.includes(s)} onChange={() => toggleStation(s)} style={{ accentColor: '#028090' }} />
                      <span style={{ fontSize: 14, color: '#0D1B3E' }}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', fontSize: 14, cursor: 'pointer', color: '#64748B' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ flex: 2, padding: '12px', borderRadius: 8, border: 'none', background: saving ? '#94A3B8' : '#028090', color: 'white', fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : 'Create campaign'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Campaigns</div>
            <div style={{ fontSize: 14, color: '#64748B' }}>Track booked vs. aired spots for every campaign</div>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ background: '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            + New campaign
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total campaigns',    value: campaigns.length },
            { label: 'Active',             value: campaigns.filter(c => c.status === 'active').length },
            { label: 'Total spots booked', value: campaigns.reduce((a,c) => a + (c.booked || 0), 0) },
            { label: 'Total spots aired',  value: campaigns.reduce((a,c) => a + (c.aired || 0), 0) },
          ].map(card => (
            <div key={card.label} style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#0D1B3E' }}>{card.value}</div>
            </div>
          ))}
        </div>

        {campaigns.length > 0 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['all','active','completed'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '6px 18px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                  background: filter === f ? '#0D1B3E' : 'white', color: filter === f ? 'white' : '#64748B',
                  boxShadow: filter === f ? 'none' : '0 0 0 1px #E2E8F0' }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        {campaigns.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 12, padding: '3rem', border: '0.5px solid #E2E8F0', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>📋</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#0D1B3E', marginBottom: 8 }}>No campaigns yet</div>
            <div style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>Create your first campaign to start tracking ad plays against your booked schedule.</div>
            <button onClick={() => setShowModal(true)}
              style={{ background: '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              + Create first campaign
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((c, i) => {
              const pct = compliance(c.booked, c.aired)
              const color = complianceColor(pct)
              const shortfall = c.booked - c.aired
              return (
                <div key={i} style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: '#0D1B3E' }}>{c.name}</span>
                        <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600,
                          background: c.status === 'active' ? '#DCFCE7' : '#F1F5F9',
                          color: c.status === 'active' ? '#16A34A' : '#64748B' }}>
                          {c.status?.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{c.advertiser} {c.agency ? '· ' + c.agency : ''}</div>
                      <div style={{ fontSize: 12, color: '#94A3B8' }}>{c.start} to {c.end} · {c.stations?.join(', ')}</div>
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
                    <div style={{ background: '#F1F5F9', borderRadius: 4, height: 6 }}>
                      <div style={{ width: Math.min(pct,100) + '%', height: '100%', background: color, borderRadius: 4 }}></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
