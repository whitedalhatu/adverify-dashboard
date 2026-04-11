'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const from = params.get('from') || '/dashboard'

  async function handleLogin() {
    if (!password) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push(from)
    } else {
      setError('Incorrect password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui', background: '#0D1B3E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 400, margin: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#0D1B3E', marginBottom: 4 }}>AdVerify</div>
          <div style={{ fontSize: 18, color: '#028090', marginBottom: 16 }}>Nigeria</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>Enter your access password to continue</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: '#0D1B3E', display: 'block', marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter access password"
            autoFocus
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: error ? '1px solid #EF4444' : '1px solid #E2E8F0', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
          {error && <div style={{ fontSize: 12, color: '#EF4444', marginTop: 6 }}>{error}</div>}
        </div>

        <button onClick={handleLogin} disabled={loading || !password}
          style={{ width: '100%', background: loading || !password ? '#94A3B8' : '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: loading || !password ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Checking...' : 'Access dashboard'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#94A3B8' }}>
          Operated by Hatmann Nigeria Limited · adverify.ng
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<div style={{ background: '#0D1B3E', minHeight: '100vh' }} />}>
      <LoginForm />
    </Suspense>
  )
}
