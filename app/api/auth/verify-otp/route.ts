import { NextResponse } from 'next/server'
import { otpStore } from '@/lib/otpStore'

export async function POST(req: Request) {
  const { email, otp } = await req.json()
  if (!email || !otp) return NextResponse.json({ success: false, error: 'Email and OTP required' })

  const savedOtp = otpStore[email]
  if (!savedOtp) return NextResponse.json({ success: false, error: 'OTP expired or not generated' })

  if (savedOtp !== otp) return NextResponse.json({ success: false, error: 'Invalid OTP' })

  // OTP verified successfully, remove from store
  delete otpStore[email]

  return NextResponse.json({ success: true, message: 'OTP verified successfully' })
}
