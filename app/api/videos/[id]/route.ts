import { connectDB } from "@/lib/db";
import { Video } from "@/lib/models/video";
import { getSessionUser } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function DELETE(_req: NextRequest, ctx: RouteContext<"/api/videos/[id]">) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return Response.json({ ok: false, message: "Not authenticated." }, { status: 401 });
    }

    await connectDB();

    const { id } = await ctx.params;
    await Video.deleteOne({ videoId: id });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, message: "Could not delete video." }, { status: 500 });
  }
}
