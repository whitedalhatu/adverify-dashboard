'use client'
import { useState, useRef, useEffect } from 'react'
import Nav from '../components/Nav'

const STATIONS = [
  { id: 'freedom-kano',   name: 'Freedom Radio Kano',   market: 'Kano',   frequency: '99.3 FM',  streamUrl: 'https://stream.zeno.fm/t8bhnmek8mzuv', uptime: 99.3, rf: true,  rfFreq: '99.3 MHz' },
  { id: 'dala-fm',        name: 'Dala FM Kano',         market: 'Kano',   frequency: '88.5 FM',  streamUrl: 'https://stream.zeno.fm/9zdvuszaanzuv', uptime: 98.1, rf: true,  rfFreq: '88.5 MHz' },
  { id: 'freedom-kaduna', name: 'Freedom Radio Kaduna', market: 'Kaduna', frequency: '92.9 FM',  streamUrl: 'https://stream.zeno.fm/5z9v4k7e9mzuv', uptime: 98.7, rf: false, rfFreq: '92.9 MHz' },
  { id: 'freedom-dutse',  name: 'Freedom Radio Dutse',  market: 'Dutse',  frequency: '99.5 FM',  streamUrl: 'https://stream.zeno.fm/wp75as7e9mzuv', uptime: 97.9, rf: false, rfFreq: '99.5 MHz' },
]

export default function Stations() {
  const [selected, setSelected] = useState<string | null>(null)
  const [playing, setPlaying] = useState<string | null>(null)
  const [playingLayer, setPlayingLayer] = useState<'stream' | 'rf' | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [volume, setVolume] = useState(0.8)
  const [rfModal, setRfModal] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function playStream(stationId: string, streamUrl: string) {
    if (playing === stationId && playingLayer === 'stream') {
      audioRef.current?.pause()
      setPlaying(null)
      setPlayingLayer(null)
      return
    }
    if (audioRef.current) audioRef.current.pause()
    setLoading(stationId)
    const audio = new Audio(streamUrl)
    audio.volume = volume
    audio.play()
      .then(() => { setPlaying(stationId); setPlayingLayer('stream'); setLoading(null) })
      .catch(() => { setLoading(null); alert('Stream temporarily unavailable. Try again in a moment.') })
    audioRef.current = audio
    audio.onended = () => { setPlaying(null); setPlayingLayer(null) }
    audio.onerror = () => { setPlaying(null); setPlayingLayer(null); setLoading(null) }
  }

  function playRF(station: typeof STATIONS[0]) {
    if (!station.rf) {
      setRfModal('expanding')
      return
    }
    setRfModal(station.id)
  }

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume }, [volume])
  useEffect(() => { return () => { audioRef.current?.pause() } }, [])

  const station = STATIONS.find(s => s.id === selected)
  const rfModalStation = STATIONS.find(s => s.id === rfModal)

  return (
    <div style={{ fontFamily: 'system-ui', background: '#F5F7FA', minHeight: '100vh' }}>
      <Nav />

      {/* RF modal */}
      {rfModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 440 }}>
            {rfModal === 'expanding' ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0D1B3E', marginBottom: 8 }}>RF Layer — Expanding</div>
                  <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7 }}>
                    RF broadcast monitoring for this station is scheduled for deployment. An RTL-SDR receiver node will be installed in this market to capture the physical FM broadcast independently of the digital stream.
                  </div>
                </div>
                <div style={{ background: '#FFFBEB', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#92400E' }}>
                  Currently active in Kano market — expanding to Kaduna and Dutse in Q3 2026.
                </div>
                <button onClick={() => setRfModal(null)}
                  style={{ width: '100%', background: '#0D1B3E', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Close
                </button>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#0D1B3E', marginBottom: 4 }}>RF Layer 2 — {rfModalStation?.name}</div>
                    <div style={{ fontSize: 13, color: '#64748B' }}>Physical FM broadcast · {rfModalStation?.rfFreq}</div>
                  </div>
                  <button onClick={() => setRfModal(null)} style={{ background: 'none', border: 'none', fontSize: 20, color: '#94A3B8', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ background: '#FEF2F2', borderRadius: 10, padding: '1.25rem', marginBottom: 20, border: '1px solid #FECACA' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }}></div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#991B1B' }}>RTL-SDR Receiver Not Connected</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.6 }}>
                    The RF hardware receiver for {rfModalStation?.rfFreq} is not yet connected to this device. Once the RTL-SDR dongle is plugged in, live FM audio will play here directly from the airwaves — independently of the digital stream.
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0D1B3E', marginBottom: 8 }}>How RF listening works:</div>
                  {[
                    'RTL-SDR USB dongle plugs into MacBook',
                    'Tunes to ' + rfModalStation?.rfFreq + ' FM frequency',
                    'Captures live broadcast from the airwaves',
                    'Audio sent to ACRCloud — independent of stream',
                    'Both layers must match for certified verification',
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'flex-start' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#E0F4F5', color: '#028090', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{step}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setRfModal(null)}
                    style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', fontSize: 14, cursor: 'pointer', color: '#64748B' }}>
                    Close
                  </button>
                  <button
                    style={{ flex: 2, padding: '10px', borderRadius: 8, border: 'none', background: '#94A3B8', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'not-allowed' }}>
                    📡 Connect RF receiver to enable
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Now playing bar */}
      {playing && (
        <div style={{ background: '#0D1B3E', borderBottom: '2px solid #028090', padding: '0 2rem', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', animation: 'pulse 1.5s infinite' }}></div>
            <span style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>
              Now streaming: {STATIONS.find(s => s.id === playing)?.name}
            </span>
            <span style={{ background: '#028090', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: 'white', fontWeight: 600 }}>
              {playingLayer === 'rf' ? 'RF BROADCAST' : 'STREAM'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#64748B', fontSize: 12 }}>Vol</span>
              <input type="range" min="0" max="1" step="0.05" value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={{ width: 80, accentColor: '#028090' }} />
            </div>
            <button onClick={() => { audioRef.current?.pause(); setPlaying(null); setPlayingLayer(null) }}
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
          <div style={{ fontSize: 14, color: '#64748B' }}>Click a station to expand · Stream and RF play buttons per station</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total stations',  value: STATIONS.length },
            { label: 'Markets covered', value: 2 },
            { label: 'Dual verified',   value: STATIONS.filter(s => s.rf).length },
            { label: 'Avg uptime',      value: (STATIONS.reduce((a,s) => a + s.uptime, 0) / STATIONS.length).toFixed(1) + '%' },
          ].map(card => (
            <div key={card.label} style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: '0.5px solid #E2E8F0' }}>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>{card.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#0D1B3E' }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STATIONS.map(s => {
              const isStreamPlaying = playing === s.id && playingLayer === 'stream'
              const isLoading = loading === s.id
              return (
                <div key={s.id}
                  style={{ background: 'white', borderRadius: 12, padding: '1.25rem', border: selected === s.id ? '2px solid #028090' : '0.5px solid #E2E8F0', cursor: 'pointer' }}
                  onClick={() => setSelected(selected === s.id ? null : s.id)}>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#0D1B3E' }}>{s.name}</div>
                        {s.rf && (
                          <div style={{ background: '#DCFCE7', borderRadius: 6, padding: '2px 8px', fontSize: 10, color: '#16A34A', fontWeight: 700 }}>DUAL VERIFIED</div>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: '#64748B' }}>{s.market} · {s.frequency}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', animation: isStreamPlaying ? 'pulse 1.5s infinite' : 'none' }}></div>
                      <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>LIVE</span>
                    </div>
                  </div>

                  {/* Two play buttons */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    <button
                      onClick={e => { e.stopPropagation(); playStream(s.id, s.streamUrl) }}
                      style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        background: isStreamPlaying ? '#EF4444' : '#028090', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      {isLoading ? (
                        <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                      ) : isStreamPlaying ? '■' : '▶'}
                      {isStreamPlaying ? 'Stop' : 'Stream'}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); playRF(s) }}
                      style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: s.rf ? 'none' : '1px dashed #CBD5E1', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        background: s.rf ? '#16A34A' : '#F8FAFC', color: s.rf ? 'white' : '#94A3B8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      📡 {s.rf ? 'RF ' + s.rfFreq : 'RF — Expanding'}
                    </button>
                  </div>

                  {/* Layer status bars */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ flex: 1, background: '#E0F4F5', borderRadius: 6, padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: '#028090', fontWeight: 600 }}>L1 Stream</span>
                      <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 700 }}>● LIVE</span>
                    </div>
                    <div style={{ flex: 1, background: s.rf ? '#DCFCE7' : '#F8FAFC', borderRadius: 6, padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: s.rf ? 'none' : '1px dashed #E2E8F0' }}>
                      <span style={{ fontSize: 10, color: s.rf ? '#16A34A' : '#94A3B8', fontWeight: 600 }}>L2 RF</span>
                      <span style={{ fontSize: 10, color: s.rf ? '#16A34A' : '#F59E0B', fontWeight: 700 }}>{s.rf ? '● LIVE' : '● EXPANDING'}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Detail panel */}
          {selected && station && (
            <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #E2E8F0', alignSelf: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: '#0D1B3E', marginBottom: 4 }}>{station.name}</div>
                  {station.rf && (
                    <div style={{ background: '#DCFCE7', borderRadius: 6, padding: '2px 10px', fontSize: 11, color: '#16A34A', fontWeight: 700, display: 'inline-block' }}>DUAL VERIFIED</div>
                  )}
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: 20, color: '#94A3B8', cursor: 'pointer' }}>×</button>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <button onClick={() => playStream(station.id, station.streamUrl)}
                  style={{ flex: 1, background: playing === station.id && playingLayer === 'stream' ? '#EF4444' : '#028090', color: 'white', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {playing === station.id && playingLayer === 'stream' ? '■ Stop stream' : '▶ Layer 1 — Stream'}
                </button>
                <button onClick={() => playRF(station)}
                  style={{ flex: 1, background: station.rf ? '#16A34A' : '#F1F5F9', color: station.rf ? 'white' : '#94A3B8', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  📡 Layer 2 — RF
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <div style={{ background: '#E0F4F5', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#028090', marginBottom: 4 }}>LAYER 1 — DIGITAL STREAM</div>
                  <div style={{ fontSize: 12, color: '#0D1B3E' }}>15-second audio chunks from online stream · ACRCloud fingerprint matching</div>
                  <div style={{ fontSize: 11, color: '#22C55E', fontWeight: 600, marginTop: 4 }}>● ACTIVE NOW</div>
                </div>
                <div style={{ background: station.rf ? '#DCFCE7' : '#F8FAFC', borderRadius: 8, padding: '10px 14px', border: station.rf ? 'none' : '1px dashed #CBD5E1' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: station.rf ? '#16A34A' : '#94A3B8', marginBottom: 4 }}>LAYER 2 — RF BROADCAST ({station.rfFreq})</div>
                  <div style={{ fontSize: 12, color: station.rf ? '#0D1B3E' : '#94A3B8' }}>
                    {station.rf ? 'RTL-SDR receiver tuned to ' + station.rfFreq + ' · Physical FM capture · Independent verification' : 'Deploying to ' + station.market + ' market — Q3 2026'}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4, color: station.rf ? '#16A34A' : '#F59E0B' }}>
                    {station.rf ? '● ACTIVE' : '● EXPANDING'}
                  </div>
                </div>
              </div>

              {[
                ['Market',       station.market],
                ['Frequency',    station.frequency],
                ['Stream uptime', station.uptime + '%'],
                ['RF layer',     station.rf ? 'Active — ' + station.rfFreq : 'Expanding'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid #F1F5F9' }}>
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
