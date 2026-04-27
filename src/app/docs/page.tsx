import Link from "next/link";
import { Hammer, Wrench, ArrowLeft, Construction } from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-12 relative z-10">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 dark:bg-yellow-500/10 rounded-full blur-xl animate-pulse" />
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-yellow-50 dark:bg-yellow-900/30 rounded-full border border-yellow-200 dark:border-yellow-700/50 flex items-center justify-center relative shadow-lg shadow-yellow-500/10">
                <Construction className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-sm font-medium border border-yellow-200 dark:border-yellow-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              Under Construction
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-black dark:text-white">
              We&apos;re Building <br className="hidden sm:block" />
              <span className="text-blue-600 dark:text-blue-500">Something Amazing</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
              This application is currently under development. Our team of engineers is working hard to bring you comprehensive documentation and resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center gap-4">
              <Hammer className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
              <div className="text-left">
                <p className="font-bold text-sm text-black dark:text-white">API Docs</p>
                <p className="text-xs text-zinc-500">Coming soon</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center gap-4">
              <Wrench className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
              <div className="text-left">
                <p className="font-bold text-sm text-black dark:text-white">Guides</p>
                <p className="text-xs text-zinc-500">In progress</p>
              </div>
            </div>
          </div>

          <div className="pt-8">
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
