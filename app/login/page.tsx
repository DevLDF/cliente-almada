"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="w-full max-w-sm">
        {/* Marca */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
            style={{ background: "var(--gradient-primary)" }}
          >
            <span className="text-white text-lg font-bold" style={{ fontFamily: "var(--font-jakarta)" }}>
              A
            </span>
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-jakarta), sans-serif",
              color: "var(--color-on-background)",
              letterSpacing: "-0.02em",
            }}
          >
            {siteConfig.name}
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {siteConfig.description}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-[2rem] p-8 space-y-5"
          style={{
            background: "var(--color-surface-lowest)",
            boxShadow: "var(--shadow-ambient)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--color-on-surface-variant)" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  className="input-field pl-9"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label
                className="block text-xs font-semibold mb-2 tracking-wide uppercase"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "var(--color-on-surface-variant)" }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pl-9"
                />
              </div>
            </div>

            {error && (
              <p
                className="text-xs px-3 py-2 rounded-xl"
                style={{
                  background: "#fff1f0",
                  color: "#b91c1c",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                "Ingresando..."
              ) : (
                <>
                  Ingresar
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
