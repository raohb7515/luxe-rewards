import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json()
    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Sanitize name
    const cleanName = name
      .trim()
      .replace(/\s+/g, ' ') // remove duplicate spaces
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove hidden zero-width characters

    // Validate clean name
    if (cleanName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Invalid name entered' },
        { status: 400 }
      )
    }

    // Check if OTP was verified (OTP record should exist and not be expired)
    const otpRecord = await prisma.oTP.findUnique({
      where: { email },
    })

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'Please verify your OTP first' },
        { status: 400 }
      )
    }

    // Check expiration
    if (new Date() > otpRecord.expiresAt) {
      await prisma.oTP.delete({ where: { email } })
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await prisma.user.create({
      data: { name: cleanName, email, password: hashedPassword },
    })

    // Delete OTP after successful registration
    await prisma.oTP.delete({ where: { email } })

    // Generate JWT token
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
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
