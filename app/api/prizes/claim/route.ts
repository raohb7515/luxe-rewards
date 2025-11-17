import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { z } from 'zod'

const claimSchema = z.object({
  prizeId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    if (user instanceof NextResponse) return user

    const body = await request.json()
    const { prizeId } = claimSchema.parse(body)

    const prize = await prisma.prize.findUnique({
      where: { id: prizeId },
    })

    if (!prize || !prize.isActive) {
      return NextResponse.json(
        { success: false, error: 'Prize not available' },
        { status: 400 }
      )
    }

    if (prize.stock <= 0) {
      return NextResponse.json(
        { success: false, error: 'Prize out of stock' },
        { status: 400 }
      )
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
    })

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    if (userData.cashback < prize.points) {
      return NextResponse.json(
        { success: false, error: 'Insufficient cashback balance' },
        { status: 400 }
      )
    }

    // Create claim
    const claim = await prisma.prizeClaim.create({
      data: {
        userId: user.userId,
        prizeId,
        status: 'pending',
      },
    })

    // Deduct cashback
    await prisma.user.update({
      where: { id: user.userId },
      data: {
        cashback: {
          decrement: prize.points,
        },
      },
    })

    // Create transaction record
    await prisma.cashbackTransaction.create({
      data: {
        userId: user.userId,
        amount: -prize.points,
        type: 'spent',
        description: `Claimed prize: ${prize.name}`,
      },
    })

    // Update prize stock
    await prisma.prize.update({
      where: { id: prizeId },
      data: {
        stock: {
          decrement: 1,
        },
      },
    })

    return NextResponse.json({
      success: true,
      claim,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Failed to claim prize' },
      { status: 500 }
    )
  }
}

