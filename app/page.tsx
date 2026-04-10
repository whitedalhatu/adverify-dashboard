import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui', background: '#0D1B3E', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <div style={{ textAlign: 'center', maxWidth: 600, padding: '2rem' }}>
        <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 8 }}>AdVerify</div>
        <div style={{ fontSize: 28, color: '#028090', marginBottom: 32 }}>Nigeria</div>
        <div style={{ fontSize: 16, color: '#CADCFC', marginBottom: 48, lineHeight: 1.7 }}>
          The first independent broadcast ad verification platform for the Nigerian market.
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard" style={{ background: '#028090', color: 'white', padding: '14px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
            Open Dashboard
          </Link>
          <Link href="/campaigns" style={{ border: '1px solid #028090', color: '#028090', padding: '14px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
            Campaigns
          </Link>
          <Link href="/query" style={{ border: '1px solid #CADCFC', color: '#CADCFC', padding: '14px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
            Query Plays
          </Link>
        </div>
        <div style={{ marginTop: 64, fontSize: 12, color: '#7B93B8' }}>
          Operated by Hatmann Nigeria Limited · adverify.ng
        </div>
      </div>
    </div>
  )
}
