"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, useCurrentUser } from "@/lib/api-client";
import { SiteHeader } from "@/components/site-header";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [router, user, loading]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = await loginUser(email.trim(), password);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.push("/");
  };

  return (
    <div className="page-shell">
      <SiteHeader />
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            background: "rgba(0, 0, 0, 0.75)",
            borderRadius: "16px",
            padding: "3rem 3.5rem",
            border: "1px solid rgba(245, 247, 251, 0.08)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span
              style={{
                fontFamily: "var(--font-title), sans-serif",
                fontSize: "2.2rem",
                color: "var(--brand)",
                letterSpacing: "0.08em",
              }}
            >
              DUMMYFLIX
            </span>
          </div>

          <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "0 0 1.5rem", color: "#fff" }}>
            Sign In
          </h1>

          <form style={{ display: "grid", gap: "1rem" }} onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="email">Email or Username</label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com or admin"
                style={{ background: "#333", border: "none", borderRadius: "4px", padding: "1rem 0.8rem", color: "#fff", fontSize: "1rem" }}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Your password"
                style={{ background: "#333", border: "none", borderRadius: "4px", padding: "1rem 0.8rem", color: "#fff", fontSize: "1rem" }}
              />
            </div>

            {error ? <p className="error">{error}</p> : null}

            <button
              className="primary-btn"
              type="submit"
              style={{ width: "100%", padding: "0.85rem", fontSize: "1rem", fontWeight: 700, border: "none", cursor: "pointer", color: "#fff", background: "var(--brand)", marginTop: "0.5rem" }}
            >
              Sign In
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "#b3b3b3" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  style={{ accentColor: "var(--brand)" }}
                />
                Remember me
              </label>
              <span style={{ cursor: "pointer", color: "#b3b3b3" }}>Need help?</span>
            </div>
          </form>

          <div style={{ marginTop: "3rem", fontSize: "1rem", color: "#737373" }}>
            New to DummyFlix?{" "}
            <Link href="/signup" style={{ color: "#fff", fontWeight: 500 }}>
              Sign up now.
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
