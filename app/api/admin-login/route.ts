import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, name, password } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Match secret admin password
  const ADMIN_SECRET = process.env.ADMIN_PASSWORD || "adminsecret123" // password supposed to be in .env file
  if (password !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Invalid admin key" }, { status: 401 });
  }

  let user = await prisma.user.findUnique({ where: { email } });

  // If user exists and has no name, update it
  if (user) {
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Not an admin account" }, { status: 403 });
    }

    if (!user.name && name) {
      user = await prisma.user.update({
        where: { email },
        data: { name },
      });
    }

    return NextResponse.json({ user });
  }

  // Create new admin account
  user = await prisma.user.create({
    data: {
      email,
      name,
      role: "admin",
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
