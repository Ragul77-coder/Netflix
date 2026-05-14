import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/test-dummy-netflix";

const cached = (global as Record<string, unknown>).__mongoose as
  | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
  | undefined;

const state = cached ?? { conn: null, promise: null };
(global as Record<string, unknown>).__mongoose = state;

export async function connectDB() {
  if (state.conn) return state.conn;
  if (!state.promise) {
    state.promise = mongoose.connect(MONGODB_URI);
  }
  state.conn = await state.promise;
  return state.conn;
}
