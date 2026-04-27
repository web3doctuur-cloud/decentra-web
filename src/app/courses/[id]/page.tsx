'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  ArrowLeft, 
  ChevronRight, 
  GraduationCap,
  Trophy,
  Loader2,
  Wallet
} from 'lucide-react'
import Link from 'next/link'
import { useAccount } from '@/lib/web3-provider'
import { useParams } from 'next/navigation'

// Load ReactPlayer dynamically to avoid SSR issues and fix the module path
const ReactPlayer = dynamic(() => import('react-player'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
    </div>
  )
})

export default function CoursePlayerPage() {
  const { id } = useParams() as { id: string }
  const [course, setCourse] = useState<{ id: string; title: string; description: string; price?: number; [key: string]: unknown } | null>(null)
  const [lessons, setLessons] = useState<Array<{ id: string; title: string; youtube_url: string; order_index: number; [key: string]: unknown }>>([])
  const [currentLesson, setCurrentLesson] = useState<{ id: string; title: string; youtube_url: string; order_index: number; [key: string]: unknown } | null>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  
  // Fake payment states
  const { isConnected } = useAccount()
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentStep, setPaymentStep] = useState('')

  const supabase = createClient()

  useEffect(() => {
    async function loadCourseData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load course & lessons
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()
      
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', id)
        .order('order_index', { ascending: true })

      // Load enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', id)
        .eq('student_id', user.id)
        .single()

      // Load progress
      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('student_id', user.id)

      setCourse(courseData)
      setLessons(lessonsData || [])
      setCurrentLesson(lessonsData?.[0])
      setIsEnrolled(!!enrollment)
      setCompletedLessons(progress?.map(p => p.lesson_id) || [])
      setIsLoading(false)
    }

    loadCourseData()
  }, [id, supabase])

  const enrollInCourse = async () => {
    if (!isConnected) {
      alert("Please connect your Web3 wallet first to enroll.")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert("Please log in first.")
      return
    }

    // Fake Payment Flow
    setIsProcessingPayment(true)
    setPaymentStep('Awaiting wallet confirmation...')
    
    // Simulate wallet popup delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setPaymentStep('Transaction submitted. Waiting for block confirmation...')
    
    // Simulate blockchain confirmation delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setPaymentStep('Enrollment successful!')

    // Actual Database Insert
    const { error } = await supabase
      .from('enrollments')
      .insert({ course_id: id, student_id: user.id })

    if (!error) {
      setIsEnrolled(true)
    } else {
      alert("Error enrolling in database.")
    }
    
    setIsProcessingPayment(false)
  }

  const toggleLessonCompletion = async (lessonId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (completedLessons.includes(lessonId)) {
      await supabase
        .from('lesson_progress')
        .delete()
        .eq('lesson_id', lessonId)
        .eq('student_id', user.id)
      
      setCompletedLessons(prev => prev.filter(id => id !== lessonId))
    } else {
      await supabase
        .from('lesson_progress')
        .insert({ lesson_id: lessonId, student_id: user.id })
      
      setCompletedLessons(prev => [...prev, lessonId])
    }
  }

  if (isLoading) return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    </div>
  )

  if (!course) return <div className="p-12 text-center font-bold">Course not found</div>

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Top Bar */}
      <nav className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/courses" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-zinc-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800"></div>
          <h1 className="text-lg font-bold text-black dark:text-white truncate max-w-md">{course.title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 rounded-full text-sm font-medium">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-zinc-600 dark:text-zinc-400">
              {completedLessons.length} / {lessons.length} Completed
            </span>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors">
            Share Progress
          </button>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
        {/* Main Content: Video Player */}
        <main className="flex-1 overflow-y-auto bg-black flex flex-col">
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            {isEnrolled ? (
              <ReactPlayer
                src={currentLesson?.youtube_url}
                width="100%"
                height="100%"
                controls
                onEnded={() => currentLesson && toggleLessonCompletion(currentLesson.id)}
                className="absolute top-0 left-0"
              />
            ) : (
              <div className="flex flex-col items-center gap-6 p-12 text-center max-w-xl mx-auto">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600">
                  <GraduationCap className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-white leading-tight">Ready to start building?</h2>
                <p className="text-zinc-400 text-lg leading-relaxed">Enroll in this course to access all lessons and track your learning progress on-chain.</p>
                {isProcessingPayment ? (
                  <div className="flex flex-col items-center gap-4 bg-zinc-900/80 p-8 rounded-3xl border border-zinc-800 w-full max-w-sm">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-blue-400 font-bold text-center">{paymentStep}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Testnet Simulation</p>
                  </div>
                ) : (
                  <button 
                    onClick={enrollInCourse}
                    className="bg-blue-600 flex items-center gap-3 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                  >
                    <Wallet className="w-6 h-6" />
                    {isConnected ? `Enroll with Wallet (${(course.price || 0) > 0 ? course.price + ' ETH' : 'Free'})` : 'Connect Wallet to Enroll'}
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex-1 bg-white dark:bg-zinc-900 p-8 lg:p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-extrabold text-black dark:text-white leading-tight">
                  {currentLesson?.title || course.title}
                </h2>
                {isEnrolled && currentLesson && (
                  <button 
                    onClick={() => toggleLessonCompletion(currentLesson.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                      completedLessons.includes(currentLesson.id) 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                    }`}
                  >
                    {completedLessons.includes(currentLesson.id) ? (
                      <><CheckCircle2 className="w-5 h-5" /> Completed</>
                    ) : (
                      <><Circle className="w-5 h-5" /> Mark as Complete</>
                    )}
                  </button>
                )}
              </div>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                {course.description}
              </p>
            </div>
          </div>
        </main>

        {/* Sidebar: Lesson List */}
        <aside className="w-full lg:w-96 bg-white dark:bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-black dark:text-white">Course Content</h3>
            <p className="text-sm text-zinc-500 mt-1">{lessons.length} Lessons • Web3 Development</p>
          </div>
          
          <div className="flex-1">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
                className={`w-full flex items-start gap-4 p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-left border-b border-zinc-100 dark:border-zinc-800 group ${
                  currentLesson?.id === lesson.id ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="mt-1 shrink-0 transition-transform group-active:scale-90">
                  {completedLessons.includes(lesson.id) ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : currentLesson?.id === lesson.id ? (
                    <PlayCircle className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-zinc-300 dark:text-zinc-700" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Lesson {index + 1}</span>
                  <h4 className={`font-bold leading-tight ${
                    currentLesson?.id === lesson.id ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-700 dark:text-zinc-300'
                  }`}>
                    {lesson.title}
                  </h4>
                </div>
                <ChevronRight className={`w-5 h-5 self-center transition-all ${
                  currentLesson?.id === lesson.id ? 'text-blue-600 translate-x-1' : 'text-zinc-300 opacity-0 group-hover:opacity-100'
                }`} />
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
