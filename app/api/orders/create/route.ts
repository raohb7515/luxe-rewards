import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const orderSchema = z.object({
  productId: z.string(),
  amount: z.number().positive(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    if (user instanceof NextResponse) return user

    const body = await request.json()
    const { productId, amount } = orderSchema.parse(body)

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Product not available' },
        { status: 400 }
      )
    }

    if (product.stock < 1) {
      return NextResponse.json(
        { success: false, error: 'Product out of stock' },
        { status: 400 }
      )
    }

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        productId,
        amount,
        status: 'pending',
      },
    })

    // Stripe checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.image],
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${productId}`,
      metadata: {
        orderId: order.id,
        userId: user.userId,
      },
    })

    // Save Stripe ID
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeId: session.id },
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })

  } catch (error) {
    console.error("ORDER ERROR:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
