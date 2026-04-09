"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { FaCheckCircle, FaLock, FaArrowLeft, FaPlay, FaClock, FaEthereum, FaUserGraduate } from "react-icons/fa";

interface Chapter {
  title: string;
  videoId: string;
  duration: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  instructor_name: string;
  instructor_id: string;
  thumbnail_url: string;
  chapters: Chapter[];
  total_chapters: number;
}

export default function CourseViewPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Debug: log the courseId
    console.log("Course ID from params:", courseId);
    console.log("Full params:", params);
    
    if (!courseId) {
      console.error("No course ID found in URL");
      router.push("/courses");
      return;
    }
    
    checkAuthAndLoad();
  }, [courseId]);

  const checkAuthAndLoad = async () => {
    setLoading(true);
    
    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);

    // Load course details
    await loadCourse();

    if (currentUser && courseId) {
      await checkEnrollment(currentUser.id);
    }

    setLoading(false);
  };

  const loadCourse = async () => {
    if (!courseId) {
      console.error("Cannot load course: No course ID");
      router.push("/courses");
      return;
    }

    console.log("Fetching course with ID:", courseId);
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (error) {
      console.error("Error loading course:", error);
      router.push("/courses");
      return;
    }

    if (!data) {
      console.error("No course found with ID:", courseId);
      router.push("/courses");
      return;
    }

    console.log("Course loaded:", data.title);

    // Parse chapters if they're stored as JSON string
    let chapters = data.chapters;
    if (typeof chapters === 'string') {
      try {
        chapters = JSON.parse(chapters);
      } catch (e) {
        console.error("Error parsing chapters:", e);
        chapters = [];
      }
    }

    setCourse({
      ...data,
      chapters: chapters || [],
      total_chapters: chapters?.length || 0
    });
  };

  const checkEnrollment = async (userId: string) => {
    if (!courseId) return;
    
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .single();

    if (data && !error) {
      setIsEnrolled(true);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!courseId) {
      alert("Invalid course");
      return;
    }

    const { error } = await supabase
      .from('enrollments')
      .insert([
        {
          course_id: courseId,
          user_id: user.id,
          progress: 0,
          enrolled_at: new Date().toISOString()
        }
      ]);

    if (error) {
      alert("Error enrolling: " + error.message);
    } else {
      setIsEnrolled(true);
      alert("Successfully enrolled!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Course not found</p>
          <Link href="/courses">
            <button className="px-6 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700">
              Back to Courses
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Not Enrolled View
  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <div className="relative h-96 bg-slate-900">
          {course.thumbnail_url && (
            <img 
              src={course.thumbnail_url} 
              alt={course.title}
              className="w-full h-full object-cover opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-6xl mx-auto">
              <Link href="/courses" className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-4">
                <FaArrowLeft /> Back to Courses
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="flex items-center gap-1 text-purple-400">
                  <FaEthereum /> {course.price} ETH
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <FaUserGraduate /> {course.instructor_name}
                </span>
              </div>
              <p className="text-slate-300 text-lg max-w-2xl">{course.description}</p>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4">Course Content</h2>
              <div className="space-y-3">
                {course.chapters?.map((chapter, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{chapter.title}</p>
                      {chapter.duration && <p className="text-xs text-slate-500">{chapter.duration}</p>}
                    </div>
                    <FaLock className="text-slate-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-900/30 to-slate-900 rounded-2xl p-6 border border-purple-500/30 sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-white">{course.price} ETH</p>
                  <p className="text-slate-400 text-sm">One-time payment</p>
                </div>
                <button
                  onClick={handleEnroll}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Enroll Now
                </button>
                {!user && (
                  <p className="text-center text-xs text-slate-500 mt-4">
                    <Link href="/login" className="text-purple-400">Login</Link> to enroll
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enrolled View - Watch Course
  const currentChapterData = course.chapters?.[currentChapter];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-purple-500/20 sticky top-0 z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
            <FaArrowLeft /> Dashboard
          </Link>
          <h1 className="text-white font-bold truncate max-w-md">{course.title}</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Video Player Area */}
        <div className="flex-1">
          {/* Video Player */}
          {currentChapterData ? (
            <>
              <VideoPlayer 
                videoId={currentChapterData.videoId} 
                title={currentChapterData.title}
              />
              <div className="p-6 bg-slate-900/50">
                <h2 className="text-2xl font-bold text-white mb-2">{currentChapterData.title}</h2>
                {currentChapterData.duration && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <FaClock /> {currentChapterData.duration}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="aspect-video bg-slate-900 flex items-center justify-center">
              <div className="text-center">
                <FaPlay className="text-5xl text-purple-500/50 mx-auto mb-4" />
                <p className="text-slate-400">Select a chapter to start learning</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Chapter List */}
        <div className="lg:w-96 bg-slate-900 border-l border-purple-500/20">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-bold text-white">Course Content</h3>
            <p className="text-xs text-slate-500 mt-1">{course.total_chapters} lessons</p>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
            {course.chapters?.map((chapter, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentChapter(idx)}
                className={`w-full text-left p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${
                  currentChapter === idx ? 'bg-purple-600/10 border-l-4 border-l-purple-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center">
                      <span className="text-xs text-slate-500">{idx + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${currentChapter === idx ? 'text-purple-400 font-medium' : 'text-white'}`}>
                      {chapter.title}
                    </p>
                    {chapter.duration && (
                      <p className="text-xs text-slate-500 mt-1">{chapter.duration}</p>
                    )}
                  </div>
                  <FaPlay className="text-xs text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}