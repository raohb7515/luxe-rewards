// middleware.ts (root)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

const ADMIN_PREFIX = "/admin";
const encodedSecret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

type AdminPayload = JWTPayload & {
  isAdmin?: boolean;
};

async function verifyAdminToken(token: string): Promise<AdminPayload> {
  // jose is edge-compatible, so we can verify inside middleware
  const { payload } = await jwtVerify(token, encodedSecret);
  return payload as AdminPayload;
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return redirectToLogin(req);
  }

  try {
    const payload = await verifyAdminToken(token);
    if (!payload?.isAdmin) {
      return redirectToLogin(req);
    }
    return NextResponse.next();
  } catch (error) {
    console.error("middleware admin check failed", error);
    return redirectToLogin(req);
  }
}

export const config = {
  matcher: [`${ADMIN_PREFIX}/:path*`],
};
