import { ImageResponse } from 'next/og'
 
export const alt = 'Simon Cheung Tak Leung - Full Stack & DevOps Engineer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #334155 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 60,
          fontWeight: 700,
          color: 'white',
          textAlign: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: 72,
            marginBottom: 20,
          }}
        >
          Simon Cheung Tak Leung
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#e2e8f0',
            marginBottom: 40,
          }}
        >
          Full Stack & DevOps Engineer
        </div>
        <div
          style={{
            display: 'flex',
            gap: 40,
            fontSize: 24,
            color: '#94a3b8',
          }}
        >
          <span>React</span>
          <span>•</span>
          <span>Node.js</span>
          <span>•</span>
          <span>AWS</span>
          <span>•</span>
          <span>DevOps</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
