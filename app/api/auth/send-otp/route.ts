import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ success: false, error: 'Email is required' })

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "MyApp"

  try {
    // Save OTP in DB
    await prisma.oTP.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    })

    console.log(`Generated OTP for ${email}: ${otp} (expires in 5 mins)`)

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${APP_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🔑 Your ${APP_NAME} OTP Code`,
      html: `<h1>Your OTP: ${otp}</h1><p>Valid for 5 minutes.</p>`,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Failed to send OTP' })
  }
}
