import { signup } from "../../actions";
import Link from "next/link";
import { Users, GraduationCap, User, AtSign, Lock } from "lucide-react";

export default function InstructorSignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4 py-12 font-sans">
      <div className="w-full max-w-xl p-8 space-y-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-4">
            <Users className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-black dark:text-white leading-tight">Join as an Instructor</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Share your expertise with the world.</p>
        </div>

        <form className="mt-8 space-y-6" action={signup}>
          {/* Hidden Role Input */}
          <input type="hidden" name="role" value="instructor" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                name="full_name"
                type="text"
                required
                autoComplete="name"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-black dark:text-white"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <AtSign className="w-4 h-4" /> Username
              </label>
              <input
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-black dark:text-white"
                placeholder="instructor_pro"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Professional Headline
            </label>
            <input
              name="headline"
              type="text"
              required
              autoComplete="organization-title"
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-black dark:text-white"
              placeholder="e.g. Senior Solidity Developer & Educator"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-black dark:text-white"
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
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-black dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/20 transition-all transform active:scale-[0.98]"
          >
            Create Instructor Account
          </button>
        </form>

        <div className="text-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-sm text-zinc-500">
            Wrong account type?{" "}
            <Link href="/signup" className="text-blue-600 font-bold hover:underline">Change to Student</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
