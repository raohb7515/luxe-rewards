import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { otpStore } from '@/lib/otpStore'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, otp, name, password } = await req.json()
    if (!email || !otp || !name || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    // verify OTP
    if (!otpStore[email]) {
      return NextResponse.json({ success: false, error: 'OTP expired or not generated' }, { status: 400 })
    }

    if (otpStore[email] !== otp) {
      return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 400 })
    }

    delete otpStore[email] // remove OTP after verification

    // check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, isAdmin: false },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
