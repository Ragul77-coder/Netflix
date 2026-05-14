"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCurrentUser, deleteVideo, useVideoCatalog } from "@/lib/api-client";
import { SiteHeader } from "@/components/site-header";
import type { AdminUser } from "@/lib/types";

type AdminStats = {
  totalUsers: number;
  totalVideos: number;
  totalCategories: number;
};

type RecentVideo = {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  createdBy?: string;
};

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const { videos, refresh: refreshVideos } = useVideoCatalog();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [recentVideos, setRecentVideos] = useState<RecentVideo[]>([]);
  const [tab, setTab] = useState<"overview" | "users" | "videos">("overview");
  const [error, setError] = useState("");

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.ok) {
        setStats(data.stats);
        setRecentVideos(data.recentVideos);
      }
    } catch {
      setError("Failed to load stats.");
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.ok) {
        setUsers(data.users);
      }
    } catch {
      setError("Failed to load users.");
    }
  }, []);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchStats();
      fetchUsers();
    }
  }, [user, fetchStats, fetchUsers]);

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data.ok) {
      fetchUsers();
      fetchStats();
    } else {
      alert(data.message);
    }
  };

  const handleDeleteVideo = async (id: string, title: string) => {
    if (!confirm(`Delete video "${title}"?`)) return;
    await deleteVideo(id);
    refreshVideos();
    fetchStats();
  };

  if (loading || !user?.isAdmin) {
    return null;
  }

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="dashboard-page">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.8rem" }}>Admin Panel</h1>
          <span
            style={{
              background: "var(--brand)",
              color: "#fff",
              fontSize: "0.7rem",
              padding: "0.2rem 0.6rem",
              borderRadius: "4px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Admin
          </span>
        </div>

        {error && <p className="error">{error}</p>}

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {(["overview", "users", "videos"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "0.5rem 1.2rem",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: tab === t ? "var(--brand)" : "rgba(255,255,255,0.12)",
                background: tab === t ? "rgba(229,9,20,0.15)" : "transparent",
                color: tab === t ? "#fff" : "var(--soft-ink)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.9rem",
                fontWeight: tab === t ? 600 : 400,
                transition: "all 0.2s",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "overview" && (
          <>
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-value">{stats?.totalUsers ?? "—"}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats?.totalVideos ?? "—"}</div>
                <div className="stat-label">Total Videos</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats?.totalCategories ?? "—"}</div>
                <div className="stat-label">Categories</div>
              </div>
            </div>

            <section className="dashboard-list" style={{ marginTop: "1rem" }}>
              <h2>Recent Videos</h2>
              <table className="video-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Created By</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVideos.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <Image
                          className="table-thumb"
                          src={v.thumbnail}
                          alt={v.title}
                          width={80}
                          height={45}
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td style={{ color: "#fff", fontWeight: 500 }}>{v.title}</td>
                      <td style={{ color: "var(--soft-ink)" }}>{v.category}</td>
                      <td style={{ color: "var(--soft-ink)" }}>{v.createdBy || "System"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="dashboard-list" style={{ marginTop: "1rem" }}>
              <h2>Recent Users</h2>
              <table className="video-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map((u) => (
                    <tr key={u._id}>
                      <td style={{ color: "#fff", fontWeight: 500 }}>{u.name}</td>
                      <td style={{ color: "var(--soft-ink)" }}>{u.email}</td>
                      <td>
                        {u.isAdmin ? (
                          <span
                            style={{
                              background: "rgba(229,9,20,0.15)",
                              color: "#ff9aa2",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                            }}
                          >
                            Admin
                          </span>
                        ) : (
                          <span style={{ color: "var(--soft-ink)", fontSize: "0.85rem" }}>User</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <section className="dashboard-list">
            <h2>All Users ({users.length})</h2>
            <p className="muted">Manage all registered users.</p>
            <table className="video-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ color: "#fff", fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: "var(--soft-ink)" }}>{u.email}</td>
                    <td>
                      {u.isAdmin ? (
                        <span
                          style={{
                            background: "rgba(229,9,20,0.15)",
                            color: "#ff9aa2",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          Admin
                        </span>
                      ) : (
                        <span style={{ color: "var(--soft-ink)", fontSize: "0.85rem" }}>User</span>
                      )}
                    </td>
                    <td>
                      {!u.isAdmin && (
                        <button
                          className="icon-btn delete"
                          onClick={() => handleDeleteUser(u._id, u.name)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Videos Tab */}
        {tab === "videos" && (
          <section className="dashboard-list">
            <h2>All Videos ({videos.length})</h2>
            <p className="muted">Manage the entire video catalog.</p>
            <div style={{ overflowX: "auto" }}>
              <table className="video-table">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <Image
                          className="table-thumb"
                          src={v.thumbnail}
                          alt={v.title}
                          width={80}
                          height={45}
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td>
                        <a href={`/watch/${v.id}`} style={{ color: "#fff", fontWeight: 500 }}>
                          {v.title}
                        </a>
                      </td>
                      <td style={{ color: "var(--soft-ink)" }}>{v.category}</td>
                      <td style={{ color: "var(--soft-ink)" }}>{v.createdBy || "System"}</td>
                      <td>
                        <button
                          className="icon-btn delete"
                          onClick={() => handleDeleteVideo(v.id, v.title)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
