import { connectDB } from "@/lib/db";
import { Video } from "@/lib/models/video";
import { getSessionUser } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";
import type { VideoItem } from "@/lib/types";

export async function GET() {
  try {
    await connectDB();
    await ensureSeeded();

    const docs = await Video.find().sort({ createdAt: -1 }).lean();

    const videos: VideoItem[] = docs.map((doc) => ({
      id: doc.videoId,
      title: doc.title,
      category: doc.category,
      thumbnail: doc.thumbnail,
      videoUrl: doc.videoUrl,
      description: doc.description || "",
      createdBy: doc.createdBy,
    }));

    return Response.json({ videos });
  } catch {
    return Response.json({ videos: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return Response.json({ ok: false, message: "Not authenticated." }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const videoId = `video-${Date.now()}`;

    const doc = await Video.create({
      videoId,
      title: body.title,
      category: body.category,
      thumbnail: body.thumbnail,
      videoUrl: body.videoUrl,
      description: body.description || "",
      createdBy: body.createdBy || user.email,
    });

    const video: VideoItem = {
      id: doc.videoId,
      title: doc.title,
      category: doc.category,
      thumbnail: doc.thumbnail,
      videoUrl: doc.videoUrl,
      description: doc.description,
      createdBy: doc.createdBy,
    };

    return Response.json({ ok: true, video });
  } catch {
    return Response.json({ ok: false, message: "Could not add video." }, { status: 500 });
  }
}
