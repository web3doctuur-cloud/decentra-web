'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, Github, Twitter, Linkedin } from 'lucide-react'
import { SignOutButton } from './sign-out-button'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

import type { User } from '@supabase/supabase-js'

export function Footer() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Hide footer on auth pages
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/signup')
  if (isAuthPage) return null

  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-black dark:text-white">DecentraWeb</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Empowering the next generation of builders through decentralized education and on-chain credentials.
          </p>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="#" className="hover:text-blue-600 transition-colors"><Twitter className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors"><Github className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-blue-700 transition-colors"><Linkedin className="w-5 h-5" /></Link>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-black dark:text-white mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li><Link href="/courses" className="hover:text-blue-600 transition-colors">Browse Courses</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Learning Paths</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Certifications</Link></li>
            {user && (
              <li><SignOutButton className="text-sm text-red-500 hover:text-red-600 transition-colors" /></li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-black dark:text-white mb-4">Community</h4>
          <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Discord</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Events</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-black dark:text-white mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-50 dark:border-zinc-800 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>© 2026 DecentraWeb. Created with 🧡 by Hadizah Yusuf.</p>
      </div>
    </footer>
  )
}
