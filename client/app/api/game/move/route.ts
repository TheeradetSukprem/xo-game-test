import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

export const POST = withApiAuthRequired(async (req: NextRequest) => {
  try {
    const { accessToken } = await getAccessToken(req, NextResponse.next())
    const body = await req.json()

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in game move route:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to make move' },
      { status: 500 }
    )
  }
})
