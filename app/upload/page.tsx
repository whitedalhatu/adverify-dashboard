'use client'
import { useState, useRef } from 'react'
import Nav from '../components/Nav'

const STATIONS = [
  { id: 'freedom-kano',   name: 'Freedom Radio Kano',   frequency: '99.3 FM' },
  { id: 'dala-fm',        name: 'Dala FM Kano',         frequency: '88.5 FM' },
  { id: 'freedom-kaduna', name: 'Freedom Radio Kaduna', frequency: '92.9 FM' },
  { id: 'freedom-dutse',  name: 'Freedom Radio Dutse',  frequency: '99.5 FM' },
]

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [advertiser, setAdvertiser] = useState('')
  const [agency, setAgency] = useState('')
  const [stations, setStations] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<any>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function toggleStation(id: string) {
    setStations(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  async function handleUpload() {
    if (!file || !title || !advertiser || stations.length === 0) {
      setMessage('Please fill in all fields, select at least one station, and choose an audio file.')
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
    formData.append('stations', JSON.stringify(stations))

    try {
      const res = await fetch('/api/upload-creative', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
        setResult(data)
        setMessage('Ad creative registered successfully. The monitor will now detect it automatically on the selected stations.')
        setFile(null)
        setTitle('')
        setAdvertiser('')
        setAgency('')
        setStations([])
        if (fileRef.current) fileRef.current.value = ''
      } else {
        setStatus('error')
        setMessage(data.error || 'Upload failed. Make sure the fingerprint server is running.')
      }
    } catch (err: any) {
      setStatus('error')
      setMessage('Connection failed. Make sure the fingerprint server is running on localhost:5000.')
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
      <div style={{ padding: '2rem', maxWidth: 620, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Register ad creative</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>Upload your MP3 — the system fingerprints it and starts detecting it on your selected stations immediately.</div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* File picker */}
            <div>
              <label style={labelStyle}>Audio file <span style={{ color: '#EF4444' }}>*</span></label>
              <div onClick={() => fileRef.current?.click()}
                style={{ border: '2px dashed #E2E8F0', borderRadius: 8, padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                  background: file ? '#F0FDF4' : '#FAFAFA', borderColor: file ? '#22C55E' : '#E2E8F0' }}>
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

            {/* Title */}
            <div>
              <label style={labelStyle}>Ad title <span style={{ color: '#EF4444' }}>*</span></label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. FCMB Group Radio 30s April 2026" style={inputStyle} />
            </div>

            {/* Advertiser + Agency */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Advertiser <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={advertiser} onChange={e => setAdvertiser(e.target.value)}
                  placeholder="e.g. FCMB" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Agency <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span></label>
                <input value={agency} onChange={e => setAgency(e.target.value)}
                  placeholder="e.g. SO&U" style={inputStyle} />
              </div>
            </div>

            {/* Station selection */}
            <div>
              <label style={labelStyle}>Stations to monitor <span style={{ color: '#EF4444' }}>*</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {STATIONS.map(s => (
                  <label key={s.id} onClick={() => toggleStation(s.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                      padding: '10px 12px', borderRadius: 8,
                      border: stations.includes(s.id) ? '1.5px solid #028090' : '1px solid #E2E8F0',
                      background: stations.includes(s.id) ? '#E0F4F5' : 'white' }}>
                    <input type="checkbox" checked={stations.includes(s.id)} onChange={() => {}}
                      style={{ accentColor: '#028090', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0D1B3E' }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{s.frequency}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <button onClick={() => setStations(STATIONS.map(s => s.id))}
                  style={{ fontSize: 12, color: '#028090', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Select all
                </button>
                <span style={{ color: '#E2E8F0' }}>·</span>
                <button onClick={() => setStations([])}
                  style={{ fontSize: 12, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  Clear
                </button>
              </div>
            </div>

            {/* Status message */}
            {message && (
              <div style={{ padding: '12px 16px', borderRadius: 8, fontSize: 13, lineHeight: 1.6,
                background: status === 'success' ? '#DCFCE7' : status === 'error' ? '#FEF2F2' : '#E0F4F5',
                color: status === 'success' ? '#16A34A' : status === 'error' ? '#EF4444' : '#028090' }}>
                {message}
                {result && (
                  <div style={{ marginTop: 8, fontSize: 12 }}>
                    Duration: {result.duration?.toFixed(1)}s · Monitoring on: {result.stations?.length || stations.length} station{(result.stations?.length || stations.length) > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )}

            {/* Submit button */}
            <button onClick={handleUpload} disabled={status === 'uploading'}
              style={{ background: status === 'uploading' ? '#94A3B8' : '#028090', color: 'white',
                border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600,
                cursor: status === 'uploading' ? 'not-allowed' : 'pointer' }}>
              {status === 'uploading' ? '⏳ Fingerprinting and registering...' : '🎵 Register ad creative'}
            </button>
          </div>
        </div>

        {/* Info box */}
        <div style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #E2E8F0' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1B3E', marginBottom: 12 }}>How it works</div>
          {[
            ['1', 'Select your MP3 or WAV ad file'],
            ['2', 'Enter the advertiser name and title'],
            ['3', 'Choose which stations to monitor'],
            ['4', 'Click register — fingerprinted in seconds'],
            ['5', 'Every play appears in the dashboard automatically'],
          ].map(([num, text]) => (
            <div key={num} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#028090', color: 'white',
                fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
              <div style={{ fontSize: 13, color: '#64748B', paddingTop: 3 }}>{text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
