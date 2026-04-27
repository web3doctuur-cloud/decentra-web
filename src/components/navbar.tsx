'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GraduationCap, BookOpen, Menu, X, LayoutDashboard } from 'lucide-react'
import { ConnectButton } from '@/lib/web3-provider'
import { createClient } from '@/lib/supabase/client'
import { SignOutButton } from '@/components/sign-out-button'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    // Handle scroll effect
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)

    async function getProfile(userId: string) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      setRole(profile?.role || 'student')
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        await getProfile(currentUser.id)
      } else {
        setRole(null)
      }
    })

    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        getProfile(user.id)
      } else {
        setUser(null)
        setRole(null)
      }
    })

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dashboardPath = role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 shadow-sm' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black dark:text-white">DecentraWeb</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            <Link href="/courses" className="hover:text-blue-600 dark:hover:text-white transition-colors">Courses</Link>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-white transition-colors">About</Link>
          </div>
          
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>

          <div className="flex items-center gap-4">
            {mounted && (
              user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    href={dashboardPath} 
                    className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all border border-blue-100/50 dark:border-blue-800/50"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <SignOutButton className="p-2.5 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors" />
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="text-sm font-bold text-black dark:text-white hover:text-blue-600 transition-colors px-4"
                >
                  Log In
                </Link>
              )
            )}
            {mounted && user && (
              <div className="scale-90 origin-right">
                <ConnectButton />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 top-[64px] bg-white dark:bg-black z-40 transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 space-y-8 flex flex-col h-full">
          <div className="space-y-4">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-4">Navigation</p>
            <div className="flex flex-col gap-2">
              <Link 
                href="/courses" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-4 text-lg font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-2xl transition-colors"
              >
                <BookOpen className="w-6 h-6 text-blue-600" />
                Browse Courses
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 p-4 text-lg font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-2xl transition-colors"
              >
                <GraduationCap className="w-6 h-6 text-blue-600" />
                About Us
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-4">Account</p>
            <div className="flex flex-col gap-4">
              {mounted && (
                user ? (
                  <>
                    <Link 
                      href={dashboardPath} 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-4 p-4 text-lg font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-2xl"
                    >
                      <LayoutDashboard className="w-6 h-6" />
                      My Dashboard
                    </Link>
                    <SignOutButton className="flex items-center gap-4 p-4 text-lg font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-colors w-full text-left" />
                  </>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center p-4 text-lg font-bold text-white bg-black dark:bg-white dark:text-black rounded-2xl shadow-xl active:scale-95 transition-transform"
                  >
                    Sign In to DecentraWeb
                  </Link>
                )
              )}
            </div>
          </div>

          {mounted && user && (
            <div className="mt-auto pb-12 space-y-4">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-4">Web3 Wallet</p>
              <div className="flex justify-center w-full scale-110">
                <ConnectButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
