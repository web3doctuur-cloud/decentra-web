import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, LayoutDashboard, BookOpen, Clock, Award, PlayCircle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { EditableProfile } from "@/components/editable-profile";
import { SignOutButton } from "@/components/sign-out-button";

export default async function StudentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-black dark:text-white">Profile not found</h1>
          <p className="text-zinc-600 dark:text-zinc-400">There was an error loading your profile. Please try logging out and signing up again.</p>
          <SignOutButton className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold" showIcon={false} />
        </div>
      </div>
    );
  }

  // Fetch student's enrollments
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('student_id', user.id);

  // Fetch completed lessons count
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('student_id', user.id);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-black dark:text-white">DecentraWeb</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/student/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-semibold">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/courses" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <BookOpen className="w-5 h-5" />
            Browse Courses
          </Link>
          <Link href="/achievements" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <Award className="w-5 h-5" />
            Certificates
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <SignOutButton className="flex items-center gap-3 px-4 py-3 w-full text-zinc-600 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors rounded-xl font-semibold" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <DashboardHeader 
          title="Student Dashboard" 
          subtitle={`Keep building the future, ${profile?.full_name || user.email?.split('@')[0]}`} 
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Active Courses</p>
                <p className="text-2xl font-bold text-black dark:text-white">{enrollments?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Lessons Completed</p>
                <p className="text-2xl font-bold text-black dark:text-white">{progress?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Certificates</p>
                <p className="text-2xl font-bold text-black dark:text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mb-12">
          <EditableProfile profile={profile} />
        </div>

        {/* Courses Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">My Enrolled Courses</h2>
          {enrollments && enrollments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrollments.filter((e: any) => e.courses).map((enrollment: { id: string; courses: { id: string; thumbnail_url: string; title: string; description: string; [key: string]: unknown }; [key: string]: unknown }) => (
                <Link 
                  key={enrollment.id} 
                  href={`/courses/${enrollment.courses.id}`}
                  className="flex bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group transition-all hover:shadow-lg"
                >
                  <div className="w-40 h-full relative overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={enrollment.courses.thumbnail_url} 
                      alt={enrollment.courses.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center gap-2">
                    <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                      {enrollment.courses.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1 leading-relaxed">
                      {enrollment.courses.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white">No active courses yet</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">Start your journey into Web3 by browsing our available courses.</p>
                <Link href="/courses" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 mt-4">
                  Explore Courses
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
