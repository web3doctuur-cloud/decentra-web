'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Minus, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewCoursePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [lessons, setLessons] = useState([{ title: '', youtube_url: '' }])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const addLesson = () => {
    setLessons([...lessons, { title: '', youtube_url: '' }])
  }

  const removeLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index))
  }

  const updateLesson = (index: number, field: 'title' | 'youtube_url', value: string) => {
    const updatedLessons = lessons.map((lesson, i) => 
      i === index ? { ...lesson, [field]: value } : lesson
    )
    setLessons(updatedLessons)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // 1. Create Course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title,
          description,
          instructor_id: user.id,
          thumbnail_url: `https://img.youtube.com/vi/${getYouTubeId(lessons[0].youtube_url)}/maxresdefault.jpg`
        })
        .select()
        .single()

      if (courseError) throw courseError

      // 2. Create Lessons
      const lessonsToInsert = lessons.map((lesson, index) => ({
        course_id: course.id,
        title: lesson.title,
        youtube_url: lesson.youtube_url,
        order_index: index
      }))

      const { error: lessonsError } = await supabase
        .from('lessons')
        .insert(lessonsToInsert)

      if (lessonsError) throw lessonsError

      router.refresh()
      router.push('/instructor/dashboard')
    } catch (error: unknown) {
      alert((error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/instructor/dashboard" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-white">Create New Course</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Course Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="e.g. Master Solidity & Blockchain Development"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Describe what students will learn in this course..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-black dark:text-white">Lessons</h2>
              <button
                type="button"
                onClick={addLesson}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-500 font-bold transition-colors"
              >
                <Plus className="w-5 h-5" /> Add Lesson
              </button>
            </div>

            {lessons.map((lesson, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-4">
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => updateLesson(index, 'title', e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Lesson Title"
                  />
                  <input
                    type="url"
                    value={lesson.youtube_url}
                    onChange={(e) => updateLesson(index, 'youtube_url', e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=...)"
                  />
                </div>
                {lessons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? 'Creating Course...' : <><Save className="w-5 h-5" /> Create Course</>}
          </button>
        </form>
      </div>
    </div>
  )
}
