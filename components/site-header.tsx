"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutUser, useCurrentUser } from "@/lib/api-client";

export function SiteHeader() {
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
  };

  const onAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="DummyFlix Home">
        DUMMYFLIX
      </Link>
      <nav className="nav-items">
        {!onAuthPage ? (
          <Link className="nav-link" href="/">
            Home
          </Link>
        ) : null}
        <Link className="nav-link" href="/dashboard">
          Dashboard
        </Link>
        {user ? (
          <>
            {user.isAdmin && (
              <Link
                className="nav-link"
                href="/admin"
                style={{ borderColor: "rgba(229,9,20,0.5)", color: "#ff9aa2" }}
              >
                Admin
              </Link>
            )}
            <span className="muted">Hi, {user.name}</span>
            <button className="danger-btn" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" href="/login">
              Login
            </Link>
            <Link className="nav-link" href="/signup">
              Signup
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
