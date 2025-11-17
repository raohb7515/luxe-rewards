import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from './auth'

export async function requireAuth(request: NextRequest) {
  const token = getTokenFromRequest(request)
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const payload = verifyToken(token)
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }

  return payload
}

export async function requireAdmin(request: NextRequest) {
  const payload = await requireAuth(request)
  
  if (payload instanceof NextResponse) {
    return payload
  }

  if (!payload.isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    )
  }

  return payload
}

