import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const prizes = await prisma.prize.findMany({
      where: { isActive: true },
      orderBy: { points: 'asc' },
    })

    return NextResponse.json({
      success: true,
      prizes,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prizes' },
      { status: 500 }
    )
  }
}

