'use client'
import { useState } from 'react'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [advertiser, setAdvertiser] = useState('')
  const [agency, setAgency] = useState('')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleUpload() {
    if (!file || !title || !advertiser) {
      setMessage('Please fill in all required fields and select an audio file.')
      setStatus('error')
      return
    }

    setStatus('uploading')
    setMessage('Uploading and registering fingerprint with ACRCloud...')

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
      if (res.ok) {
        setStatus('success')
        setMessage('Ad creative registered successfully. The monitor will now detect it when it airs.')
        setFile(null)
        setTitle('')
        setAdvertiser('')
        setAgency('')
      } else {
        setStatus('error')
        setMessage('Error: ' + (data.error || 'Upload failed'))
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error — please try again.')
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <div style={{ background: '#0D1B3E', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>AdVerify</span>
          <span style={{ color: '#028090', fontWeight: 400, fontSize: 20 }}>Nigeria</span>
        </div>
        <nav style={{ display: 'flex', gap: 24 }}>
          {['Dashboard', 'Campaigns', 'Query', 'Stations', 'Upload'].map(item => (
            <a key={item} href={item === 'Upload' ? '/upload' : `/${item.toLowerCase()}`}
              style={{ color: item === 'Upload' ? '#028090' : '#CADCFC', textDecoration: 'none', fontSize: 14 }}>
              {item}
            </a>
          ))}
        </nav>
      </div>

      <div style={{ padding: '2rem', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Register ad creative</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>Upload an audio file to register its fingerprint. The monitor will detect it automatically when it airs.</div>
        </div>

        <div style={{ background: 'white', borderRadius: 12, padding: '2rem', border: '0.5px solid #E2E8F0' }}>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#0D1B3E', display: 'block', marginBottom: 8 }}>
              Audio file <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div
              onClick={() => document.getElementById('fileInput')?.click()}
              style={{ border: '2px dashed #E2E8F0', borderRadius: 8, padding: '2rem', textAlign: 'center', cursor: 'pointer', background: file ? '#E0F4F5' : '#F8FAFC' }}>
              <div style={{ fontSize: 13, color: file ? '#028090' : '#64748B', fontWeight: file ? 600 : 400 }}>
                {file ? file.name : 'Click to select MP3 or WAV file'}
              </div>
              {file && (
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept="audio/*"
              style={{ display: 'none' }}
              onChange={e => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#0D1B3E', display: 'block', marginBottom: 8 }}>
              Ad title <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Dangote Cement 30s April 2026"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#0D1B3E', display: 'block', marginBottom: 8 }}>
              Advertiser <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              value={advertiser}
              onChange={e => setAdvertiser(e.target.value)}
              placeholder="e.g. Dangote Group"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#0D1B3E', display: 'block', marginBottom: 8 }}>
              Agency <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              value={agency}
              onChange={e => setAgency(e.target.value)}
              placeholder="e.g. SO&U"
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {message && (
            <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 8, fontSize: 13,
              background: status === 'success' ? '#DCFCE7' : status === 'error' ? '#FEF2F2' : '#E0F4F5',
              color: status === 'success' ? '#16A34A' : status === 'error' ? '#EF4444' : '#028090' }}>
              {message}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={status === 'uploading'}
            style={{ width: '100%', background: status === 'uploading' ? '#94A3B8' : '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: status === 'uploading' ? 'not-allowed' : 'pointer' }}>
            {status === 'uploading' ? 'Registering fingerprint...' : 'Register ad creative'}
          </button>
        </div>

        <div style={{ marginTop: 24, background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0' }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#0D1B3E', marginBottom: 12 }}>How it works</div>
          {[
            'Upload your ad audio file (MP3 or WAV)',
            'ACRCloud generates a unique audio fingerprint',
            'The monitor worker continuously listens to all stations',
            'When the ad airs, it is detected within 30 seconds',
            'A play event is logged with timestamp, station and confidence score',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#E0F4F5', color: '#028090', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: '#64748B', paddingTop: 2 }}>{step}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
