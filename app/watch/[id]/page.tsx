"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { VideoCard } from "@/components/video-card";
import { useVideoCatalog } from "@/lib/api-client";

const MATURITY_RATINGS = ["TV-MA", "PG-13", "TV-14", "R", "PG"];

function toYouTubeEmbed(url: string) {
  if (url.includes("youtube.com/watch")) {
    const parsed = new URL(url);
    const videoId = parsed.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }
  return null;
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export default function WatchPage() {
  const params = useParams<{ id: string }>();
  const { videos } = useVideoCatalog();
  const video = videos.find((entry) => entry.id === params.id);

  const relatedVideos = video
    ? videos.filter((v) => v.category === video.category && v.id !== video.id).slice(0, 6)
    : [];

  if (!video) {
    return (
      <div className="page-shell">
        <SiteHeader />
        <main className="watch-page">
          <div className="watch-card">
            <h1>Video Not Found</h1>
            <p className="muted">This video may have been removed.</p>
            <Link className="red-btn" href="/">
              Back To Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const youtubeEmbed = toYouTubeEmbed(video.videoUrl);
  const directVideo = isDirectVideo(video.videoUrl);
  const rating = MATURITY_RATINGS[video.title.length % MATURITY_RATINGS.length];

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="watch-page">
        <div className="watch-card">
          {youtubeEmbed ? (
            <iframe
              className="video-frame"
              src={youtubeEmbed}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : directVideo ? (
            <video className="video-element" controls autoPlay src={video.videoUrl} poster={video.thumbnail} />
          ) : (
            <iframe
              className="video-frame"
              src={video.videoUrl}
              title={video.title}
              allow="autoplay; encrypted-media"
            />
          )}

          <div className="watch-info">
            <h1>{video.title}</h1>
            <div className="watch-meta">
              <span className="maturity-badge">{rating}</span>
              <span className="muted">2024</span>
              <span className="muted">{video.category}</span>
            </div>
            <p>{video.description}</p>
            <div style={{ marginTop: "1rem" }}>
              <Link className="ghost-btn" href="/">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Browse
              </Link>
            </div>
          </div>

          {relatedVideos.length > 0 && (
            <div className="related-section">
              <h2>More Like This</h2>
              <div className="video-row video-row--horizontal">
                {relatedVideos.map((rv) => (
                  <VideoCard key={rv.id} video={rv} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
