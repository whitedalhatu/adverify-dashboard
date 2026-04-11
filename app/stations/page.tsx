'use client'
import { useState, useRef, useEffect } from 'react'
import Nav from '../components/Nav'

const STATIONS = [
  { id: 'freedom-kano',   name: 'Freedom Radio Kano',   market: 'Kano',   frequency: '99.3 FM',  streamUrl: 'https://stream.zeno.fm/t8bhnmek8mzuv', uptime: 99.3 },
  { id: 'freedom-kaduna', name: 'Freedom Radio Kaduna', market: 'Kaduna', frequency: '92.9 FM',  streamUrl: 'https://stream.zeno.fm/5z9v4k7e9mzuv', uptime: 98.7 },
  { id: 'freedom-dutse',  name: 'Freedom Radio Dutse',  market: 'Dutse',  frequency: '99.5 FM',  streamUrl: 'https://stream.zeno.fm/wp75as7e9mzuv', uptime: 97.9 },
  { id: 'dala-fm',        name: 'Dala FM Kano',         market: 'Kano',   frequency: '88.5 FM',  streamUrl: 'https://stream.zeno.fm/9zdvuszaanzuv', uptime: 98.1 },
]

export default function Stations() {
  const [selected, setSelected] = useState<string | null>(null)
  const [playing, setPlaying] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [volume, setVolume] = useState(0.8)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function playStation(stationId: string, streamUrl: string) {
    if (playing === stationId) {
      audioRef.current?.pause()
      setPlaying(null)
      return
    }
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setLoading(stationId)
    const audio = new Audio(streamUrl)
    audio.volume = volume
    audio.play()
      .then(() => {
        setPlaying(stationId)
        setLoading(null)
      })
      .catch(() => {
        setLoading(null)
        alert('Stream temporarily unavailable. Try again in a moment.')
      })
    audioRef.current = audio
    audio.onended = () => setPlaying(null)
    audio.onerror = () => { setPlaying(null); setLoading(null) }
  }

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    return () => { audioRef.current?.pause() }
  }, [])

  const station = STATIONS.find(s => s.id === selected)

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <Nav />

      {playing && (
        <div style={{ background: '#0D1B3E', borderBottom: '2px solid #028090', padding: '0 2rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', animation: 'pulse 1.5s infinite' }}></div>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
              Now streaming: {STATIONS.find(s => s.id === playing)?.name}
            </span>
            <span style={{ color: '#028090', fontSize: 13 }}>
              {STATIONS.find(s => s.id === playing)?.frequency}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#64748B', fontSize: 12 }}>Vol</span>
              <input type="range" min="0" max="1" step="0.05" value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={{ width: 80, accentColor: '#028090' }} />
            </div>
            <button onClick={() => { audioRef.current?.pause(); setPlaying(null) }}
              style={{ background: '#EF4444', color: 'white', border: 'none', borderRadius: 6, padding: '4px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
              Stop
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>Monitored stations</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>Click a station card to expand details · Press play to listen live</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Stations live',   value: '4 / 4' },
            { label: 'Markets covered', value: '2' },
            { label: 'Avg uptime',      value: (STATIONS.reduce((a,s) => a + s.uptime, 0) / STATIONS.length).toFixed(1) + '%' },
          ].map(card => (
            <div key={card.label} style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#0D1B3E' }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STATIONS.map(s => {
              const isPlaying = playing === s.id
              const isLoading = loading === s.id
              return (
                <div key={s.id}
                  style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: selected === s.id ? '2px solid #028090' : '0.5px solid #E2E8F0', cursor: 'pointer' }}
                  onClick={() => setSelected(selected === s.id ? null : s.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#0D1B3E', marginBottom: 4 }}>{s.name}</div>
                      <div style={{ fontSize: 13, color: '#64748B' }}>{s.market} · {s.frequency}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button
                        onClick={e => { e.stopPropagation(); playStation(s.id, s.streamUrl) }}
                        style={{
                          width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer',
                          background: isPlaying ? '#EF4444' : isLoading ? '#F59E0B' : '#028090',
                          color: 'white', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0
                        }}>
                        {isLoading ? (
                          <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                        ) : isPlaying ? '■' : '▶'}
                      </button>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end', marginBottom: 4 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', animation: isPlaying ? 'pulse 1.5s infinite' : 'none' }}></div>
                          <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>LIVE</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>{s.uptime}% uptime</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ background: '#F1F5F9', borderRadius: 4, height: 5 }}>
                      <div style={{ width: s.uptime + '%', height: '100%', background: isPlaying ? '#028090' : '#22C55E', borderRadius: 4, transition: 'background 0.3s' }}></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {selected && station && (
            <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0', alignSelf: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#0D1B3E' }}>{station.name}</div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 20, color: '#94A3B8', cursor: 'pointer' }}>×</button>
              </div>

              <button
                onClick={() => playStation(station.id, station.streamUrl)}
                style={{ width: '100%', background: playing === station.id ? '#EF4444' : '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 20 }}>
                {playing === station.id ? '■  Stop stream' : '▶  Listen live'}
              </button>

              {[
                ['Market', station.market],
                ['Frequency', station.frequency],
                ['Status', 'LIVE'],
                ['Stream uptime', station.uptime + '%'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid #F1F5F9' }}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0D1B3E' }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
