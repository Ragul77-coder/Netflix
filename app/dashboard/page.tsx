"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addVideo, deleteVideo, useCurrentUser, useVideoCatalog } from "@/lib/api-client";
import { SiteHeader } from "@/components/site-header";

const DEFAULT_THUMBNAIL = "/thumbnails/creator-studio.svg";

const PRESET_CATEGORIES = [
  "Trending Now",
  "Action Picks",
  "Comedy and Family",
  "Sci-Fi Spotlight",
  "Drama & Thriller",
  "Documentaries",
  "New Releases",
  "My Uploads",
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const { videos, refresh } = useVideoCatalog();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("My Uploads");
  const [customCategory, setCustomCategory] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [thumbnail, setThumbnail] = useState(DEFAULT_THUMBNAIL);
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [router, user, loading]);

  const stats = useMemo(() => {
    const categories = new Set(videos.map((v) => v.category));
    const myVideos = videos.filter((v) => v.createdBy === user?.email);
    return {
      total: videos.length,
      categories: categories.size,
      mine: myVideos.length,
    };
  }, [videos, user]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setError("");

    const finalCategory = useCustom ? customCategory.trim() : category;

    if (!finalCategory) {
      setError("Please select or enter a category.");
      return;
    }

    try {
      await addVideo({
        title: title.trim(),
        category: finalCategory,
        thumbnail: thumbnail.trim() || DEFAULT_THUMBNAIL,
        videoUrl: videoUrl.trim(),
        description: description.trim(),
        createdBy: user?.email,
      });

      setTitle("");
      setCategory("My Uploads");
      setCustomCategory("");
      setUseCustom(false);
      setThumbnail(DEFAULT_THUMBNAIL);
      setVideoUrl("");
      setDescription("");
      setStatus("Video added to the catalog!");
      refresh();
    } catch {
      setError("Could not add video. Please try again.");
    }
  };

  const handleDelete = async (id: string, videoTitle: string) => {
    if (confirm(`Delete "${videoTitle}" from the catalog?`)) {
      await deleteVideo(id);
      refresh();
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="dashboard-page">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Videos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.categories}</div>
            <div className="stat-label">Categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.mine}</div>
            <div className="stat-label">Your Videos</div>
          </div>
        </div>

        {/* Add Video Form */}
        <section className="form-card">
          <h1>Add New Video</h1>
          <p className="muted">Add video thumbnails and stream links to the home catalog.</p>

          <form className="form-grid two-column" onSubmit={onSubmit} style={{ marginTop: "1rem" }}>
            <div className="field">
              <label htmlFor="title">Video Title</label>
              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                placeholder="Example: Midnight Chase"
              />
            </div>

            <div className="field">
              <label htmlFor="category">Category</label>
              {useCustom ? (
                <input
                  id="category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  required
                />
              ) : (
                <select
                  id="category"
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === "__custom__") {
                      setUseCustom(true);
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                >
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__custom__">+ Custom Category</option>
                </select>
              )}
              {useCustom && (
                <button
                  type="button"
                  className="icon-btn"
                  style={{ marginTop: "0.3rem" }}
                  onClick={() => {
                    setUseCustom(false);
                    setCustomCategory("");
                  }}
                >
                  Use preset
                </button>
              )}
            </div>

            <div className="field">
              <label htmlFor="thumbnail">Thumbnail URL</label>
              <input
                id="thumbnail"
                value={thumbnail}
                onChange={(event) => setThumbnail(event.target.value)}
                required
                placeholder="/thumbnails/creator-studio.svg"
              />
              {thumbnail && (
                <div className="thumbnail-preview">
                  <Image
                    src={thumbnail}
                    alt="Thumbnail preview"
                    width={120}
                    height={68}
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="video-url">Video Stream URL</label>
              <input
                id="video-url"
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                required
                placeholder="https://...mp4 or YouTube link"
              />
            </div>

            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                placeholder="Describe your video"
              />
            </div>

            {error ? <p className="error">{error}</p> : null}
            {status ? <p className="success">{status}</p> : null}

            <button className="red-btn" type="submit" style={{ gridColumn: "1 / -1" }}>
              Add Video
            </button>
          </form>
        </section>

        {/* Video List */}
        <section className="dashboard-list" style={{ marginTop: "1.5rem" }}>
          <h2>Video Catalog ({videos.length})</h2>
          <p className="muted">Manage all videos in the catalog. Click a title to watch.</p>

          <div style={{ overflowX: "auto" }}>
            <table className="video-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id}>
                    <td>
                      <Image
                        className="table-thumb"
                        src={video.thumbnail}
                        alt={video.title}
                        width={80}
                        height={45}
                        style={{ objectFit: "cover" }}
                      />
                    </td>
                    <td>
                      <a href={`/watch/${video.id}`} style={{ color: "#fff", fontWeight: 500 }}>
                        {video.title}
                      </a>
                      {video.createdBy === user?.email && (
                        <span className="own-video-badge">yours</span>
                      )}
                    </td>
                    <td style={{ color: "var(--soft-ink)" }}>{video.category}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-btn delete"
                          onClick={() => handleDelete(video.id, video.title)}
                          title="Delete video"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
