"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Move ALL hooks to the top before any conditional returns
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
    router.push("/");
  };

  const role = user?.user_metadata?.role;

  // NOW we can conditionally return after all hooks
  // HIDE NAVBAR ON INSTRUCTOR ROUTES
  if (pathname?.startsWith('/instructor')) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-slate-950 border-b border-slate-900 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold text-white tracking-tighter">
          DECENTRA<span className="text-purple-500">WEB</span>
        </Link>
        <div className="hidden md:flex gap-6 text-sm text-slate-400">
          <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
          {role === "instructor" && (
            <Link href="/instructor/dashboard" className="text-purple-400 hover:text-purple-300 font-bold">
              Teach
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-purple-400">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700 font-bold">Sign Up</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href={role === "instructor" ? "/instructor/dashboard" : "/dashboard"}>
              <Button variant="ghost" className="text-slate-300">Dashboard</Button>
            </Link>
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              Sign Out
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}