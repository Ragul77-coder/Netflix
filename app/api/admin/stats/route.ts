import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/user";
import { Video } from "@/lib/models/video";
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

    const [totalUsers, totalVideos, totalCategories] = await Promise.all([
      User.countDocuments(),
      Video.countDocuments(),
      Video.distinct("category").then((cats) => cats.length),
    ]);

    const recentVideos = await Video.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentUsers = await User.find().sort({ _id: -1 }).limit(5).select("-passwordHash").lean();

    return Response.json({
      ok: true,
      stats: { totalUsers, totalVideos, totalCategories },
      recentVideos: recentVideos.map((v) => ({
        id: v.videoId,
        title: v.title,
        category: v.category,
        thumbnail: v.thumbnail,
        createdBy: v.createdBy,
      })),
      recentUsers: recentUsers.map((u) => ({
        _id: String(u._id),
        name: u.name,
        email: u.email,
        isAdmin: u.isAdmin,
      })),
    });
  } catch {
    return Response.json({ ok: false, message: "Server error." }, { status: 500 });
  }
}
