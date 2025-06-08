import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secret-key";

export async function POST(req: NextRequest) {
  const { passkey } = await req.json();
  if (passkey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
    return NextResponse.json({ error: "Invalid passkey" }, { status: 401 });
  }

  const token = jwt.sign(
    { role: "admin" },
    JWT_SECRET,
    { expiresIn: "10m" }
  );

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_jwt", token, {
    httpOnly: true,
    path: "/",
    maxAge: 600,
    sameSite: "lax",            //  Protects against CSRF attacks.
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
