import Image from "next/image";
import Link from "next/link";
import type { VideoItem } from "@/lib/types";

type VideoCardProps = {
  video: VideoItem;
  rank?: number;
};

export function VideoCard({ video, rank }: VideoCardProps) {
  return (
    <Link href={`/watch/${video.id}`} className={`video-card${rank != null ? " video-card--ranked" : ""}`}>
      {rank != null && (
        <span className="video-card-rank">{rank}</span>
      )}
      <div className="video-thumb-wrap">
        <Image
          className="video-thumb"
          src={video.thumbnail}
          alt={`${video.title} thumbnail`}
          fill
          sizes="(max-width: 768px) 100vw, 240px"
        />
        <div className="video-card-play-overlay">
          <svg
            className="video-card-play-icon"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="23" stroke="white" strokeWidth="2" fill="rgba(0,0,0,0.5)" />
            <path d="M19 15L33 24L19 33V15Z" fill="white" />
          </svg>
        </div>
      </div>
      <div className="video-card-content">
        <h3>{video.title}</h3>
        <p>{video.category}</p>
      </div>
    </Link>
  );
}
