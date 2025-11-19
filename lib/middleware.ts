// lib/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, TokenPayload } from './auth'

/**
 * Read the JWT from either the Authorization header (Bearer) or the HTTP-only cookie.
 */
function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  const cookieToken = request.cookies.get('token')?.value
  return cookieToken ?? null
}

/**
 * Ensures a request is authenticated by validating the JWT.
 * Returns the decoded TokenPayload or a 401 JSON response.
 */
export async function requireAuth(
  request: NextRequest
): Promise<TokenPayload | NextResponse> {
  const token = getTokenFromRequest(request)

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload || !payload.userId) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
  }

  return payload
}

/**
 * Extends requireAuth to make sure the caller is an admin.
 */
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
