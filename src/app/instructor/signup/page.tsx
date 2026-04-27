"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaChalkboardTeacher } from "react-icons/fa";

export default function InstructorSignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    wallet: "",
    expertise: "",
    bio: ""
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const autoAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username || email}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          role: "instructor",
          full_name: formData.full_name,
          username: formData.username,
          wallet_address: formData.wallet,
          expertise: formData.expertise,
          bio: formData.bio,
          avatar_url: autoAvatar,
          created_at: new Date().toISOString()
        }
      }
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else if (data.user) {
      if (data.user.identities?.length === 0) {
        alert("User already exists. Please login instead.");
        router.push("/instructor/login");
      } else if (data.session) {
        alert("✅ Instructor account created successfully! You can now create courses.");
        router.push("/instructor/dashboard");
      } else {
        alert("📧 Check your email for confirmation link before logging in.");
        router.push("/instructor/login");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            DecentraWeb
          </h1>
          <p className="text-slate-500 text-sm mt-1">Become an Instructor</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 shadow-xl shadow-purple-900/10 p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mb-4">
              <FaChalkboardTeacher className="text-3xl text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Instructor Registration</h2>
            <p className="text-slate-500 text-sm mt-1">Share your knowledge with the world</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">Username *</label>
              <input
                type="text"
                placeholder="johndoe"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">Email Address *</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">Password *</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">Wallet Address *</label>
              <input
                type="text"
                placeholder="0x..."
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
                onChange={(e) => setFormData({...formData, wallet: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">Area of Expertise *</label>
              <input
                type="text"
                placeholder="Solidity, Web3, React, etc."
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-1">Bio</label>
              <textarea
                placeholder="Tell students about yourself..."
                rows={3}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-12"
            >
              {loading ? "CREATING ACCOUNT..." : "BECOME AN INSTRUCTOR"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an instructor account?{" "}
              <Link href="/instructor/login" className="text-purple-400 hover:text-purple-300 hover:underline font-bold">
                Login
              </Link>
            </p>
            
            <p className="text-center text-xs text-slate-600">
              Student?{" "}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300">
                Sign up as Student
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}