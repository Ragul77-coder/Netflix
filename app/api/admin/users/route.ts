import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { getSessionUser } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session?.isAdmin) {
      return Response.json({ ok: false, message: "Unauthorized." }, { status: 403 });
    }

    await connectDB();
    await ensureSeeded();

    const users = await User.find().select("-passwordHash").lean();

    return Response.json({
      ok: true,
      users: users.map((u) => ({
        _id: String(u._id),
        name: u.name,
        email: u.email,
        isAdmin: u.isAdmin ?? false,
      })),
    });
  } catch {
    return Response.json({ ok: false, message: "Server error." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session?.isAdmin) {
      return Response.json({ ok: false, message: "Unauthorized." }, { status: 403 });
    }

    await connectDB();

    const { userId } = await request.json();
    if (!userId) {
      return Response.json({ ok: false, message: "User ID required." }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ ok: false, message: "User not found." }, { status: 404 });
    }

    if (user.isAdmin) {
      return Response.json({ ok: false, message: "Cannot delete admin users." }, { status: 403 });
    }

    await User.findByIdAndDelete(userId);
    return Response.json({ ok: true, message: "User deleted." });
  } catch {
    return Response.json({ ok: false, message: "Server error." }, { status: 500 });
  }
}
