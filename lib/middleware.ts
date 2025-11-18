// lib/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest, TokenPayload } from './auth'

export async function requireAuth(
  request: NextRequest
): Promise<TokenPayload | NextResponse> {
  const token = getTokenFromRequest(request)

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyToken(token)

  if (!payload || !payload.userId) { // yahan userId hona chahiye
    return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 })
  }

  return payload
}

export async function requireAdmin(
  request: NextRequest
): Promise<TokenPayload | NextResponse> {
  const payload = await requireAuth(request)
  if (payload instanceof NextResponse) return payload

  if (!payload.isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    )
  }

  return payload
}
