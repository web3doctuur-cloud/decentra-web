import Link from "next/link";
import { BookOpen, Users } from "lucide-react";

export default function SignupChoicePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4 font-sans">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-100 dark:border-blue-800 mx-auto">
            Get Started with DecentraWeb
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-black dark:text-white">
            How would you like to join?
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Choose your account type to begin your decentralized learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Choice */}
          <Link 
            href="/signup/student"
            className="group relative p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-all hover:shadow-2xl hover:-translate-y-1 text-left flex flex-col items-start gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black dark:text-white">Student</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Learn Web3 technologies, earn on-chain certificates, and build your career as a blockchain developer.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold group-hover:gap-3 transition-all">
              Sign up as Student <span>&rarr;</span>
            </div>
          </Link>

          {/* Instructor Choice */}
          <Link 
            href="/signup/instructor"
            className="group relative p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-500 transition-all hover:shadow-2xl hover:-translate-y-1 text-left flex flex-col items-start gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black dark:text-white">Instructor</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Share your knowledge, create courses from YouTube, and help build the next generation of builders.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-purple-600 font-bold group-hover:gap-3 transition-all">
              Sign up as Instructor <span>&rarr;</span>
            </div>
          </Link>
        </div>

        <p className="text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
