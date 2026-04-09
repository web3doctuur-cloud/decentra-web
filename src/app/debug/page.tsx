"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DebugPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    }
    check();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="p-8 bg-slate-950 text-white min-h-screen">
      <h1 className="text-2xl mb-4">Debug Info</h1>
      <pre className="bg-slate-900 p-4 rounded-lg overflow-auto">
        {JSON.stringify({ 
          hasSession: !!session,
          user: session?.user?.email,
          role: session?.user?.user_metadata?.role,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "..."
        }, null, 2)}
      </pre>
      <button 
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.reload();
        }}
        className="mt-4 bg-red-600 px-4 py-2 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}