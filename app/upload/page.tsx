'use client'
import { useState, useRef } from 'react'
import Nav from '../components/Nav'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [advertiser, setAdvertiser] = useState('')
  const [agency, setAgency] = useState('')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<any>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload() {
    if (!file || !title || !advertiser) {
      setMessage('Please select a file and fill in the title and advertiser.')
      setStatus('error')
      return
    }
    setStatus('uploading')
    setMessage('Generating fingerprint and registering...')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('advertiser', advertiser)
    formData.append('agency', agency)

    try {
      const res = await fetch('/api/upload-creative', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
        setResult(data)
        setMessage('Ad creative registered successfully. The monitor will now detect it automatically on all stations.')
        setFile(null)
        setTitle('')
        setAdvertiser('')
        setAgency('')
        if (fileRef.current) fileRef.current.value = ''
      } else {
        setStatus('error')
        setMessage(data.error || 'Upload failed. Please try again.')
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
      <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Register ad creative</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>Upload your MP3 file — the system fingerprints it automatically and starts detecting it on all monitored stations immediately.</div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div>
              <label style={labelStyle}>Audio file <span style={{ color: '#EF4444' }}>*</span></label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{ border: '2px dashed #E2E8F0', borderRadius: 8, padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: file ? '#F0FDF4' : '#FAFAFA', borderColor: file ? '#22C55E' : '#E2E8F0' }}>
                {file ? (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#16A34A', marginBottom: 4 }}>✓ {file.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🎵</div>
                    <div style={{ fontSize: 14, color: '#64748B' }}>Click to select MP3 or WAV file</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Max 50MB</div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept=".mp3,.wav,.m4a" style={{ display: 'none' }}
                  onChange={e => setFile(e.target.files?.[0] || null)} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Ad title <span style={{ color: '#EF4444' }}>*</span></label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. FCMB Group Radio 30s April 2026"
                style={inputStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Advertiser <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={advertiser} onChange={e => setAdvertiser(e.target.value)}
                  placeholder="e.g. FCMB"
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Agency <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span></label>
                <input value={agency} onChange={e => setAgency(e.target.value)}
                  placeholder="e.g. SO&U"
                  style={inputStyle} />
              </div>
            </div>

            {message && (
              <div style={{ padding: '12px 16px', borderRadius: 8, fontSize: 13, lineHeight: 1.6,
                background: status === 'success' ? '#DCFCE7' : status === 'error' ? '#FEF2F2' : '#E0F4F5',
                color: status === 'success' ? '#16A34A' : status === 'error' ? '#EF4444' : '#028090' }}>
                {message}
                {result && (
                  <div style={{ marginTop: 8, fontSize: 12, color: '#16A34A' }}>
                    Duration: {result.duration?.toFixed(1)}s · ACR ID: {result.acrid?.substring(0, 16)}...
                  </div>
                )}
              </div>
            )}

            <button onClick={handleUpload} disabled={status === 'uploading'}
              style={{ background: status === 'uploading' ? '#94A3B8' : '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: status === 'uploading' ? 'not-allowed' : 'pointer' }}>
              {status === 'uploading' ? '⏳ Fingerprinting and registering...' : '🎵 Register ad creative'}
            </button>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #E2E8F0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1B3E', marginBottom: 12 }}>How it works</div>
          {[
            ['1', 'Select your MP3 or WAV ad file'],
            ['2', 'Fill in the advertiser and title'],
            ['3', 'Click register — system fingerprints it in seconds'],
            ['4', 'Monitor detects it automatically on all 4 stations'],
            ['5', 'Every play appears in the dashboard with timestamp'],
          ].map(([num, text]) => (
            <div key={num} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#028090', color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
              <div style={{ fontSize: 13, color: '#64748B', paddingTop: 3 }}>{text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
