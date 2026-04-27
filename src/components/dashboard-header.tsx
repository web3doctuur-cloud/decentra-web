'use client'

import { ConnectButton } from '@/lib/web3-provider'
import { ReactNode } from 'react'

export function DashboardHeader({ 
  title, 
  subtitle, 
  children 
}: { 
  title: string, 
  subtitle: string, 
  children?: ReactNode 
}) {
  return (
    <header className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div>
        <h1 className="text-4xl font-bold text-black dark:text-white leading-tight">{title}</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        {children}
        <ConnectButton />
      </div>
    </header>
  )
}
