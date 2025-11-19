// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'
import { z } from 'zod'

// Schema validation using Zod
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const isProduction = process.env.NODE_ENV === "production"

    // Parse request body
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Find user in DB
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    })

    // Create response and set cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cashback: user.cashback,
        isAdmin: user.isAdmin,
      }
    })

    // ✅ Set cookie correctly for localhost and production
    response.cookies.set("token", token, {
      httpOnly: true,                           // cannot be read by JS
      secure: isProduction,                     // true only in production
      sameSite: isProduction ? "strict" : "lax",// keep local dev functional
      maxAge: 7 * 24 * 60 * 60,                 // 7 days
      path: "/",                                // cookie available on all routes
    })

    return response

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    )
  }
}
