"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const autoAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || email}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: "student",
          full_name: fullName,
          username: username,
          wallet_address: wallet,
          avatar_url: autoAvatar,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session) {
      // Success - redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      // Email confirmation required
      alert("Please check your email for confirmation link!");
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              DecentraWeb
            </h1>
            <p className="text-slate-400 text-sm mt-2">Student Registration</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password (min 6 characters)"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Wallet Address (0x...)"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-sm"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <a href="/login" className="text-blue-400 hover:underline">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}