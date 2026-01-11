import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withApiAuthRequired(async (req: NextRequest) => {
  try {
    const { accessToken } = await getAccessToken(req, NextResponse.next())

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/score`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in score route:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch score' },
      { status: 500 }
    )
  }
})
