import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Find OTP in database
    const otpRecord = await prisma.oTP.findUnique({
      where: { email },
    })

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'OTP not found or expired' },
        { status: 400 }
      )
    }

    // Check expiration
    if (new Date() > otpRecord.expiresAt) {
      await prisma.oTP.delete({ where: { email } })
      return NextResponse.json(
        { success: false, error: 'OTP has expired' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // OTP verified successfully (don't delete it yet, register endpoint will handle it)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Verify OTP error:', err)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
