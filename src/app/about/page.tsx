import Link from "next/link";
import { User, Wallet, Code, ArrowLeft, Rocket } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-xl animate-pulse" />
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-700/50 flex items-center justify-center relative shadow-lg shadow-blue-500/10">
                <Rocket className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium border border-blue-200 dark:border-blue-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Project Status: Under Development
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-black dark:text-white">
              About <span className="text-blue-600 dark:text-blue-500">DecentraWeb</span>
            </h1>
            
            <p className="text-lg sm:text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium mt-6">
              The application is under development. This is basically a project under construction by a frontend-focused full-stack developer transitioning into Web3 dApps. Also, this application is to demonstrate the use of wallets in making payments too.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <User className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-black dark:text-white mb-3">Developer Journey</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Showcasing the transition from a frontend-focused full-stack background to building the decentralized web.</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-black dark:text-white mb-3">Web3 dApp</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Building decentralized applications with modern frontend frameworks and seamless user experiences.</p>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-black dark:text-white mb-3">Wallet Payments</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Demonstrating practical, real-world integration of crypto wallets for making direct, on-chain payments.</p>
              </div>
            </div>
          </div>

          <div className="pt-12">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" /> Return Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
