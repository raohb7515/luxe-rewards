import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { product: true, user: true },
      })

      if (order && order.status === 'pending') {
        // Calculate cashback (5% of order amount)
        const cashbackEarned = order.amount * 0.05

        // Update order status
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'paid',
            cashbackEarned,
          },
        })

        // Update user cashback
        await prisma.user.update({
          where: { id: order.userId },
          data: {
            cashback: {
              increment: cashbackEarned,
            },
          },
        })

        // Create cashback transaction record
        await prisma.cashbackTransaction.create({
          data: {
            userId: order.userId,
            amount: cashbackEarned,
            type: 'earned',
            description: `Cashback from order ${orderId}`,
            orderId: orderId,
          },
        })

        // Update product stock
        await prisma.product.update({
          where: { id: order.productId },
          data: {
            stock: {
              decrement: 1,
            },
          },
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}

