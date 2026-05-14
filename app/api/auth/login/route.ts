import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { setSessionCookie } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

export async function POST(request: Request) {
  try {
    await connectDB();
    await ensureSeeded();

    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ ok: false, message: "Email and password are required." }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return Response.json({ ok: false, message: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return Response.json({ ok: false, message: "Invalid email or password." }, { status: 401 });
    }

    const sessionUser = { name: user.name, email: user.email, isAdmin: user.isAdmin ?? false };
    await setSessionCookie(sessionUser);

    return Response.json({ ok: true, message: "Welcome back.", user: sessionUser });
  } catch {
    return Response.json({ ok: false, message: "Server error." }, { status: 500 });
  }
}
