'use client'
import { useState } from 'react'
import Nav from '../components/Nav'

export default function Upload() {
  const [title, setTitle] = useState('')
  const [advertiser, setAdvertiser] = useState('')
  const [agency, setAgency] = useState('')
  const [acrid, setAcrid] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState(1)

  async function handleSave() {
    if (!title || !advertiser || !acrid) {
      setMessage('Please fill in all required fields including the ACR ID.')
      setStatus('error')
      return
    }
    setStatus('saving')
    setMessage('Saving to database...')
    try {
      const res = await fetch('/api/upload-creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, advertiser, agency, acrid }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage('Ad creative registered successfully. The monitor will now detect it automatically.')
        setTitle('')
        setAdvertiser('')
        setAgency('')
        setAcrid('')
        setStep(1)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to save.')
      }
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid #E2E8F0', fontSize: 14, outline: 'none',
    boxSizing: 'border-box' as const, fontFamily: 'system-ui',
  }
  const labelStyle = {
    fontSize: 13, fontWeight: 500 as const, color: '#0D1B3E',
    display: 'block' as const, marginBottom: 6,
  }

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <Nav />
      <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Register ad creative</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>Upload your audio file to ACRCloud, then register it here to begin detection.</div>
        </div>

        {/* Step 1 — Upload to ACRCloud */}
        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: step === 1 ? '2px solid #028090' : '0.5px solid #E2E8F0', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > 1 ? '#22C55E' : '#028090', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#0D1B3E' }}>Upload audio file to ACRCloud</div>
          </div>
          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 1.7 }}>
            Go to the ACRCloud console and upload your MP3 file to the <strong>adverify-ng</strong> bucket. Fill in the advertiser name and station in the custom fields. Once uploaded, copy the ACR ID shown in the bucket list.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="https://console.acrcloud.com/avr?region=eu-west-1#/file-buckets/adverify-ng?id=30414" target="_blank"
              style={{ background: '#028090', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Open ACRCloud Console →
            </a>
            <button onClick={() => setStep(2)}
              style={{ background: 'white', border: '1px solid #028090', color: '#028090', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              I've uploaded the file →
            </button>
          </div>
        </div>

        {/* Step 2 — Register in AdVerify */}
        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: step === 2 ? '2px solid #028090' : '0.5px solid #E2E8F0', opacity: step < 2 ? 0.5 : 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: status === 'success' ? '#22C55E' : '#028090', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {status === 'success' ? '✓' : '2'}
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#0D1B3E' }}>Register in AdVerify database</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>ACR ID <span style={{ color: '#EF4444' }}>*</span></label>
              <input value={acrid} onChange={e => setAcrid(e.target.value)}
                placeholder="Paste the ACR ID from ACRCloud bucket list"
                style={inputStyle} disabled={step < 2} />
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Found in the ACR ID column of your bucket list</div>
            </div>

            <div>
              <label style={labelStyle}>Ad title <span style={{ color: '#EF4444' }}>*</span></label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. FCMB Group Radio 30s April 2026"
                style={inputStyle} disabled={step < 2} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Advertiser <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={advertiser} onChange={e => setAdvertiser(e.target.value)}
                  placeholder="e.g. FCMB"
                  style={inputStyle} disabled={step < 2} />
              </div>
              <div>
                <label style={labelStyle}>Agency <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span></label>
                <input value={agency} onChange={e => setAgency(e.target.value)}
                  placeholder="e.g. SO&U"
                  style={inputStyle} disabled={step < 2} />
              </div>
            </div>

            {message && (
              <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13,
                background: status === 'success' ? '#DCFCE7' : status === 'error' ? '#FEF2F2' : '#E0F4F5',
                color: status === 'success' ? '#16A34A' : status === 'error' ? '#EF4444' : '#028090' }}>
                {message}
              </div>
            )}

            <button onClick={handleSave} disabled={status === 'saving' || step < 2}
              style={{ background: status === 'saving' || step < 2 ? '#94A3B8' : '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: status === 'saving' || step < 2 ? 'not-allowed' : 'pointer' }}>
              {status === 'saving' ? 'Saving...' : 'Register ad creative'}
            </button>
          </div>
        </div>

        {/* Already registered */}
        <div style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #E2E8F0', marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1B3E', marginBottom: 8 }}>Already registered creatives</div>
          <div style={{ fontSize: 13, color: '#64748B' }}>
            Peak Yoghurt Radio Campaign · MTN Yellowpreneur Hausa 45s · FCMB Group Radio
          </div>
          <div style={{ fontSize: 12, color: '#028090', marginTop: 4 }}>3 creatives active — monitor detecting automatically</div>
        </div>
      </div>
    </div>
  )
}
