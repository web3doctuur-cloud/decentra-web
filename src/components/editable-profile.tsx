'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, AtSign, Github, Wallet, GraduationCap, Save, Edit2, X } from 'lucide-react'

export function EditableProfile({ profile }: { profile: { id: string; full_name?: string; username?: string; github_url?: string; wallet_address?: string; intended_course?: string; headline?: string; role?: string; [key: string]: unknown } | null }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    github_url: profile?.github_url || '',
    wallet_address: profile?.wallet_address || '',
    intended_course: profile?.intended_course || '',
    headline: profile?.headline || '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  if (!profile) return null

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', profile.id)

    if (!error) {
      setIsEditing(false)
      window.location.reload() // Refresh to show new data
    } else {
      alert(error.message)
    }
    setIsLoading(false)
  }

  if (!isEditing) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-black dark:text-white">Profile Information</h3>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Name</p>
            <p className="text-black dark:text-white font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" /> {profile?.full_name || 'Not set'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Username</p>
            <p className="text-black dark:text-white font-medium flex items-center gap-2">
              <AtSign className="w-4 h-4 text-zinc-400" /> @{profile?.username || 'Not set'}
            </p>
          </div>
          
          {profile?.role === 'student' ? (
            <>
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">GitHub Account</p>
                <p className="text-black dark:text-white font-medium flex items-center gap-2 truncate">
                  <Github className="w-4 h-4 text-zinc-400" /> 
                  <a href={profile?.github_url} target="_blank" className="hover:text-blue-600 truncate">
                    {profile?.github_url || 'Not set'}
                  </a>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Learning Goal</p>
                <p className="text-black dark:text-white font-medium flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-zinc-400" /> {profile?.intended_course || 'Not set'}
                </p>
              </div>
            </>
          ) : (
            <div className="col-span-2 space-y-1">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Headline</p>
              <p className="text-black dark:text-white font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-zinc-400" /> {profile?.headline || 'Not set'}
              </p>
            </div>
          )}

          <div className="col-span-2 space-y-1 pt-4 border-t border-zinc-50 dark:border-zinc-800">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Wallet Address</p>
            <p className="text-black dark:text-white font-mono text-sm flex items-center gap-2 truncate">
              <Wallet className="w-4 h-4 text-zinc-400" /> {profile?.wallet_address || 'Not connected'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleUpdate} className="bg-white dark:bg-zinc-900 border-2 border-blue-500 rounded-3xl p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-black dark:text-white">Edit Profile</h3>
        <button 
          type="button"
          onClick={() => setIsEditing(false)}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Full Name</label>
          <input
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Username</label>
          <input
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white"
          />
        </div>

        {profile?.role === 'student' ? (
          <>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">GitHub URL</label>
              <input
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Learning Goal</label>
              <input
                value={formData.intended_course}
                onChange={(e) => setFormData({ ...formData, intended_course: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white"
              />
            </div>
          </>
        ) : (
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Professional Headline</label>
            <input
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white"
            />
          </div>
        )}

        <div className="col-span-2 space-y-2">
          <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Wallet Address</label>
          <input
            value={formData.wallet_address}
            onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-black dark:text-white font-mono"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          {isLoading ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-8 py-4 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white rounded-2xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
