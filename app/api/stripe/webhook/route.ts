import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export const dynamic = "force-dynamic"; 
export const runtime = "nodejs"; 
export const preferredRegion = "auto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  try {
    // 1. Read raw request body
    const buf = await req.arrayBuffer()
    const rawBody = Buffer.from(buf)

    const signature = req.headers.get('stripe-signature')!
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

    let event: Stripe.Event

    // 2. Verify webhook signature
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ received: false }, { status: 400 })
    }

    // 3. Handle checkout session completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId
      const userId = session.metadata?.userId

      if (!orderId || !userId) {
        console.error('Order ID or User ID missing in session metadata')
        return NextResponse.json({ received: true })
      }

      const order = await prisma.order.findUnique({ where: { id: orderId } })
      if (!order) {
        console.error('Order not found for ID:', orderId)
        return NextResponse.json({ received: true })
      }

      const product = await prisma.product.findUnique({ where: { id: order.productId } })
      if (!product) {
        console.error('Product not found for ID:', order.productId)
        return NextResponse.json({ received: true })
      }

      if (product.stock < 1) {
        console.warn(`Product ${product.id} out of stock`)
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'failed' },
        })
        return NextResponse.json({ received: true })
      }

      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'paid' },
      })

      await prisma.product.update({
        where: { id: product.id },
        data: { stock: { decrement: 1 } },
      })

      console.log(`Order ${orderId} paid and stock updated`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ received: false }, { status: 500 })
  }
}
