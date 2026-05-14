import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { setSessionCookie } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

export async function POST(request: Request) {
  try {
    await connectDB();
    await ensureSeeded();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ ok: false, message: "All fields are required." }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return Response.json({ ok: false, message: "Email is already registered." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email: email.toLowerCase(), passwordHash });

    const user = { name, email: email.toLowerCase(), isAdmin: false };
    await setSessionCookie(user);

    return Response.json({ ok: true, message: "Account created.", user });
  } catch {
    return Response.json({ ok: false, message: "Server error." }, { status: 500 });
  }
}
