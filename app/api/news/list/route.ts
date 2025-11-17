import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const news = await prisma.news.findMany({
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({
      success: true,
      news,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

