"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupUser, useCurrentUser } from "@/lib/api-client";
import { SiteHeader } from "@/components/site-header";

function getPasswordStrength(password: string) {
  if (password.length === 0) return { label: "", color: "transparent", width: "0%" };
  if (password.length < 4) return { label: "Weak", color: "#e50914", width: "33%" };
  if (password.length < 8) return { label: "Medium", color: "#ff7b11", width: "66%" };
  return { label: "Strong", color: "#51cf66", width: "100%" };
}

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [router, user, loading]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    const result = await signupUser({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.push("/");
  };

  return (
    <div className="page-shell">
      <SiteHeader />
      <main className="auth-page">
        <div className="form-card">
          <h1>Create Account</h1>
          <p className="muted">Sign up to unlock streaming and manage your own video library.</p>

          <form className="form-grid" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@example.com"
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
                placeholder="Create a password"
              />
              {password.length > 0 && (
                <>
                  <div className="password-strength">
                    <div
                      className="password-strength-bar"
                      style={{ width: strength.width, background: strength.color }}
                    />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: strength.color, marginTop: "0.2rem", display: "block" }}>
                    {strength.label}
                  </span>
                </>
              )}
            </div>

            {error ? <p className="error">{error}</p> : null}

            <button className="primary-btn" type="submit">
              Sign Up
            </button>

            <p className="muted" style={{ fontSize: "0.75rem", lineHeight: 1.4 }}>
              By signing up, you agree to the DummyFlix Terms of Use and Privacy Policy.
            </p>
          </form>

          <div className="auth-footer">
            <p className="muted">
              Already have an account?{" "}
              <Link href="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
