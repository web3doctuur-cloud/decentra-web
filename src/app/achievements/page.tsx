import React from 'react'
import { Navbar } from '@/components/navbar'
import { Award, Construction, ShieldCheck, Trophy, ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AchievementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Animated Icon Section */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-blue-500/20 rounded-full animate-pulse"></div>
            <div className="relative w-32 h-32 mx-auto bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Award className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-black animate-bounce">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 text-sm font-bold border border-yellow-100 dark:border-yellow-800/50">
              <Construction className="w-4 h-4" />
              Under Construction
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-black dark:text-white">
              Your <span className="text-blue-600">On-Chain Achievements</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
              This is where your verifiable certificates will be found. 
              <span className="block mt-4 font-semibold text-blue-600 dark:text-blue-400">
                The application is still under construction—this is a demo version of DecentraWeb.
              </span>
            </p>
          </div>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            <div className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-left space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-black dark:text-white">NFT Certificates</h3>
              <p className="text-sm text-zinc-500">Every completion will be minted as a unique NFT on the blockchain, proof of your expertise.</p>
            </div>
            
            <div className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-left space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-black dark:text-white">Verifiable Skills</h3>
              <p className="text-sm text-zinc-500">Employers will be able to verify your skills directly through your connected wallet.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/courses" 
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-blue-600/20 active:scale-95 w-full sm:w-auto"
            >
              Continue Learning <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/student/dashboard" 
              className="flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all w-full sm:w-auto"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
