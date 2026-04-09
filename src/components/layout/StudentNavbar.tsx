"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaUserCircle, FaSignOutAlt, FaBookOpen, FaHome, FaUser } from "react-icons/fa";

export default function StudentNavbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="bg-slate-950/95 backdrop-blur-sm border-b border-blue-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DW</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tighter group-hover:text-blue-400 transition-colors">
              DECENTRA<span className="text-blue-500">WEB</span>
            </span>
          </Link>

          {/* Navigation Links - Student only */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2">
              <FaHome className="text-sm" /> Home
            </Link>
            <Link href="/courses" className="text-slate-300 hover:text-white transition-colors flex items-center gap-2">
              <FaBookOpen className="text-sm" /> Courses
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link href="/login">
                  <button className="text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-4 py-1.5 rounded-lg">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <button className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                    <FaUser /> Dashboard
                  </button>
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                        <FaUserCircle className="text-white" />
                      </div>
                    )}
                    <span className="text-sm text-white hidden sm:inline-block">
                      {user.user_metadata?.full_name?.split(' ')[0] || "User"}
                    </span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-blue-500/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link href="/profile">
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                          My Profile
                        </button>
                      </Link>
                      <Link href="/dashboard">
                        <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                          My Courses
                        </button>
                      </Link>
                      <hr className="my-2 border-slate-800" />
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                      >
                        <FaSignOutAlt /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}