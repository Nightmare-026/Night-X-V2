import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    const description = searchParams.get('description');

    if (!title) {
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
              }}
            >
              Night X
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to right bottom, #000000, #1a1a2e)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
            padding: '80px',
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: '#3b82f6',
              marginBottom: 20,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            Night X Utility
          </div>
          <div
            style={{
              display: 'flex',
              color: 'white',
              fontSize: 80,
              fontWeight: 'bold',
              lineHeight: 1.1,
              marginBottom: 40,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 36,
                color: '#a1a1aa',
                lineHeight: 1.4,
                maxWidth: '850px',
              }}
            >
              {description}
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
