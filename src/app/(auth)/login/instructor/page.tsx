import { login } from "../../actions";
import Link from "next/link";
import { Users, AtSign, Lock, ArrowLeft } from "lucide-react";

export default async function InstructorLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-4">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-black dark:text-white leading-tight">Instructor Login</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Welcome back, mentor.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 border border-red-200 dark:border-red-800 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" action={login}>
          <input type="hidden" name="type" value="instructor" />
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <AtSign className="w-4 h-4" /> Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white"
                placeholder="instructor@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/20 transition-all transform active:scale-[0.98]"
          >
            Log in as Instructor
          </button>
        </form>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <Link href="/login" className="text-sm text-zinc-500 hover:text-purple-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Change type
          </Link>
          <Link href="/signup/instructor" className="text-sm font-bold text-purple-600 hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
