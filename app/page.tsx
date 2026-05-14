"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { VideoCard } from "@/components/video-card";
import { useVideoCatalog } from "@/lib/api-client";

const MATURITY_RATINGS = ["TV-MA", "TV-14", "PG-13", "TV-PG", "R", "PG"];

function getMaturityRating(videoId: string): string {
  let hash = 0;
  for (let i = 0; i < videoId.length; i++) {
    hash = (hash * 31 + videoId.charCodeAt(i)) | 0;
  }
  return MATURITY_RATINGS[Math.abs(hash) % MATURITY_RATINGS.length];
}

function CategoryRow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollState, { passive: true });
      return () => el.removeEventListener("scroll", updateScrollState);
    }
  }, []);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="category-block">
      <h2>{title}</h2>
      <div className="category-row-wrapper">
        {canScrollLeft && (
          <button
            className="row-scroll-btn row-scroll-btn--left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 6L9 12L15 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div className="video-row video-row--horizontal" ref={scrollRef}>
          {children}
        </div>
        {canScrollRight && (
          <button
            className="row-scroll-btn row-scroll-btn--right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const { videos } = useVideoCatalog();

  const featured = useMemo(() => {
    if (videos.length === 0) return null;
    return videos[Math.floor(Math.random() * videos.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos.length > 0]);

  const groupedVideos = useMemo(() => {
    const byCategory = new Map<string, typeof videos>();

    for (const video of videos) {
      const existing = byCategory.get(video.category) ?? [];
      byCategory.set(video.category, [...existing, video]);
    }

    return Array.from(byCategory.entries());
  }, [videos]);

  const topTen = useMemo(() => {
    return videos.slice(0, 10);
  }, [videos]);

  return (
    <div className="page-shell">
      <SiteHeader />

      {featured ? (
        <section
          className="hero"
          style={{
            backgroundImage: `linear-gradient(0deg, var(--canvas) 0%, rgba(8,10,16,0.7) 40%, rgba(8,10,16,0.2) 100%), url(${featured.thumbnail})`,
          }}
        >
          <div className="hero-content">
            <p className="hero-tag">Featured Now</p>
            <h1>{featured.title}</h1>
            <span className="maturity-badge">{getMaturityRating(featured.id)}</span>
            <p>{featured.description}</p>
            <div className="hero-cta-row">
              <Link href={`/watch/${featured.id}`} className="primary-btn play-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M6 4L20 12L6 20V4Z" />
                </svg>
                Play
              </Link>
              <Link href={`/watch/${featured.id}`} className="ghost-btn info-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                More Info
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <main className="catalog">
        {topTen.length > 0 && (
          <CategoryRow title="Top 10 This Week">
            {topTen.map((video, index) => (
              <VideoCard key={video.id} video={video} rank={index + 1} />
            ))}
          </CategoryRow>
        )}

        {groupedVideos.map(([category, items]) => (
          <CategoryRow key={category} title={category}>
            {items.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </CategoryRow>
        ))}
      </main>
    </div>
  );
}
