import mongoose, { Schema } from "mongoose";

export interface IVideo {
  videoId: string;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  createdBy?: string;
}

const VideoSchema = new Schema<IVideo>(
  {
    videoId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String, default: "" },
    createdBy: { type: String },
  },
  { timestamps: true },
);

export const Video = mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);
