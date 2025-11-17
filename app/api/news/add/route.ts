import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'
import { z } from 'zod'

const newsSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  thumbnail: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin(request)
    if (admin instanceof NextResponse) return admin

    const body = await request.json()
    const data = newsSchema.parse(body)

    const news = await prisma.news.create({
      data,
    })

    return NextResponse.json({
      success: true,
      news,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to add news' },
      { status: 500 }
    )
  }
}

