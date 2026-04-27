'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function SignOutButton({ className, showIcon = true }: { className?: string, showIcon?: boolean }) {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/signed-out')
    router.refresh()
  }

  return (
    <button 
      onClick={handleSignOut}
      className={className || "flex items-center gap-2 text-zinc-600 hover:text-red-600 transition-colors font-medium"}
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      Sign Out
    </button>
  )
}
