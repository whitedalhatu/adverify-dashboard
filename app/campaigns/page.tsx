'use client'
import Nav from '../components/Nav'

export default function Campaigns() {
  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <Nav />
      <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Campaigns</div>
            <div style={{ fontSize: 14, color: '#64748B' }}>Track booked vs. aired spots for every campaign</div>
          </div>
          <button style={{ background: '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ New campaign</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total campaigns',    value: 0 },
            { label: 'Active',             value: 0 },
            { label: 'Total spots booked', value: 0 },
            { label: 'Total spots aired',  value: 0 },
          ].map(card => (
            <div key={card.label} style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#0D1B3E' }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '3rem', border: '0.5px solid #E2E8F0', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#0D1B3E', marginBottom: 8 }}>No campaigns yet</div>
          <div style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>Create your first campaign to start tracking ad plays against your booked schedule.</div>
          <button style={{ background: '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Create first campaign</button>
        </div>
      </div>
    </div>
  )
}
