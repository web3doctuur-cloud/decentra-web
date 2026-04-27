'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Home, LogIn, ArrowRight } from 'lucide-react'

export default function SignedOutPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/')
    }
  }, [countdown, router])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4 font-sans text-center">
      <div className="max-w-md w-full p-12 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 mx-auto">
          <LogOut className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-black dark:text-white leading-tight">See you again!</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">You have been successfully signed out.</p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/login" 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 group"
          >
            <LogIn className="w-5 h-5" />
            Do you want to login again?
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/" 
            className="w-full py-4 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
          >
            <Home className="w-5 h-5 text-zinc-400" />
            Back to Home
          </Link>
        </div>

        <div className="pt-4">
          <p className="text-xs text-zinc-400">
            Redirecting to home in <span className="font-bold text-blue-600">{countdown}</span> seconds...
          </p>
        </div>
      </div>
    </div>
  )
}
