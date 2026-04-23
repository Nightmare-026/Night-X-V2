import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Night X - The Ultimate Utility Hub';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right bottom, #000000, #1a1a2e)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to right, #3b82f6, #9333ea)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 120,
            fontWeight: 'bold',
            marginBottom: 20,
            letterSpacing: '-0.05em',
          }}
        >
          Night X
        </div>
        <div
          style={{
            fontSize: 40,
            color: '#a1a1aa', // text-gray-400
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          40+ Powerful Utilities. Zero Distractions.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
