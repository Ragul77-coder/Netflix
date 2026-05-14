import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import { User } from "./models/user";
import { Video } from "./models/video";
import { SEED_VIDEOS } from "./seed-videos";

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  await connectDB();

  const videoCount = await Video.countDocuments();
  if (videoCount === 0) {
    const videoDocs = SEED_VIDEOS.map((v) => ({
      videoId: v.id,
      title: v.title,
      category: v.category,
      thumbnail: v.thumbnail,
      videoUrl: v.videoUrl,
      description: v.description,
    }));
    await Video.insertMany(videoDocs);
  }

  // Seed demo user
  const demoExists = await User.findOne({ email: "demo@dummyflix.com" });
  if (!demoExists) {
    const hash = await bcrypt.hash("demo1234", 10);
    await User.create({
      name: "Demo User",
      email: "demo@dummyflix.com",
      passwordHash: hash,
      isAdmin: false,
    });
  }

  // Seed admin user
  const adminExists = await User.findOne({ email: "admin" });
  if (!adminExists) {
    const hash = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin",
      passwordHash: hash,
      isAdmin: true,
    });
  }

  seeded = true;
}
