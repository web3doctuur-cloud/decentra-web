'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: (address?: string) => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  const connect = (manualAddress?: string) => {
    setAddress(manualAddress || '0x71C...976F')
    setIsConnected(true)
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
  }

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useAccount() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useAccount must be used within a Web3Provider')
  }
  return context
}

export function ConnectButton() {
  const { isConnected, address, connect, disconnect } = useAccount()
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [inputAddress, setInputAddress] = useState('')

  if (isConnected) {
    return (
      <button 
        onClick={disconnect}
        className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        {address}
      </button>
    )
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsPromptOpen(!isPromptOpen)}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-9.24 2.76A8.11 8.11 0 0 1 2 15V6a1 1 0 0 1 1-1h16"/><path d="M22 10v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2z"/></svg>
        Connect Wallet
      </button>

      {isPromptOpen && (
        <div className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-2xl z-50">
          <p className="text-sm font-bold text-black dark:text-white mb-1">Demo Connection</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">Enter a custom wallet address or just click connect to use a default one.</p>
          <input 
            type="text" 
            placeholder="0x..." 
            className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 text-sm mb-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black dark:text-white"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          <div className="flex gap-2">
            <button 
              onClick={() => setIsPromptOpen(false)}
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                connect(inputAddress || '0xDemo...Wallet')
                setIsPromptOpen(false)
              }}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              Connect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
