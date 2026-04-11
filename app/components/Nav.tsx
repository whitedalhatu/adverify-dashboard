'use client'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const path = usePathname()
  const links = [
    ['Dashboard', '/dashboard'],
    ['Campaigns', '/campaigns'],
    ['Query', '/query'],
    ['Stations', '/stations'],
    ['Upload', '/upload'],
  ]
  return (
    <div style={{ background: '#0D1B3E', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, position: 'sticky', top: 0, zIndex: 100 }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <span style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>AdVerify</span>
        <span style={{ color: '#028090', fontWeight: 400, fontSize: 20 }}>Nigeria</span>
      </a>
      <nav style={{ display: 'flex', gap: 24 }}>
        {links.map(([label, href]) => (
          <a key={href} href={href} style={{ color: path === href ? '#028090' : '#CADCFC', textDecoration: 'none', fontSize: 14, fontWeight: path === href ? 600 : 400 }}>{label}</a>
        ))}
      </nav>
    </div>
  )
}
