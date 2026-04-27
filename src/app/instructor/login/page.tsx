"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaChalkboardTeacher } from "react-icons/fa";

export default function InstructorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const role = session.user.user_metadata?.role;
        if (role === "instructor") {
          router.replace("/instructor/dashboard");
        } else if (role === "student") {
          router.replace("/dashboard");
        }
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const role = session.user.user_metadata?.role;
        if (role === "instructor") {
          router.replace("/instructor/dashboard");
        } else if (role === "student") {
          router.replace("/dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session) {
      const role = data.session.user.user_metadata?.role;
      
      if (role === "instructor") {
        router.replace("/instructor/dashboard");
      } else {
        setError("This login is for instructors only. Please use student login.");
        await supabase.auth.signOut();
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            DecentraWeb
          </h1>
          <p className="text-slate-500 text-sm mt-1">Instructor Portal</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 shadow-xl shadow-purple-900/10 p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mb-4">
              <FaChalkboardTeacher className="text-3xl text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Instructor Login</h2>
            <p className="text-slate-500 text-sm mt-1">Access your teaching dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-slate-400 text-sm mb-1">Email Address</label>
              <input
                type="email"
                placeholder="instructor@decentraweb.com"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Your password"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-12"
            >
              {loading ? "AUTHENTICATING..." : "ACCESS STUDIO"}
            </button>

            <p className="text-center text-sm text-slate-500 mt-4">
              Not an instructor?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline font-bold">
                Student Login
              </Link>
            </p>
            
            <p className="text-center text-xs text-slate-600">
              New instructor?{" "}
              <Link href="/instructor/signup" className="text-purple-400 hover:text-purple-300">
                Create Instructor Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}