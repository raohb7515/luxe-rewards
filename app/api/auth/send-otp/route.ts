import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { otpStore } from '@/lib/otpStore'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ success: false, error: 'Email is required' })

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  otpStore[email] = otp
  console.log(`Generated OTP for ${email}: ${otp}`)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to send OTP' })
  }
}
