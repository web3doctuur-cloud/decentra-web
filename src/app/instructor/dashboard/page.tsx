import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, LayoutDashboard, BookOpen, Users, PlusCircle, ArrowRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { EditableProfile } from "@/components/editable-profile";
import { SignOutButton } from "@/components/sign-out-button";

export default async function InstructorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // Attempt to create profile if it doesn't exist (fail-safe for trigger issues)
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        role: user.user_metadata?.role || 'instructor',
        username: user.user_metadata?.username || `user_${user.id.slice(0, 5)}`,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error auto-creating profile:', createError);
      return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-black dark:text-white">Profile not found</h1>
            <p className="text-zinc-600 dark:text-zinc-400">There was an error loading your profile. Please try logging out and signing up again.</p>
            <SignOutButton className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-bold" />
          </div>
        </div>
      );
    }
    profile = newProfile;
  }

  // Fetch instructor's courses
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('instructor_id', user.id);

  // Fetch total students count
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, courses!inner(instructor_id)')
    .eq('courses.instructor_id', user.id);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-black dark:text-white">DecentraWeb</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/instructor/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-semibold">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/instructor/courses" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <BookOpen className="w-5 h-5" />
            My Courses
          </Link>
          <Link href="/instructor/students" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <Users className="w-5 h-5" />
            Students
          </Link>
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <SignOutButton className="flex items-center gap-3 px-4 py-3 w-full text-zinc-600 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors rounded-xl font-semibold" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <DashboardHeader 
          title="Instructor Dashboard" 
          subtitle={`Manage your courses and students, ${profile?.full_name || user.email?.split('@')[0]}`}
        >
          <Link href="/instructor/courses/new" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            <PlusCircle className="w-5 h-5" />
            Create Course
          </Link>
        </DashboardHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Active Courses</p>
                <p className="text-2xl font-bold text-black dark:text-white">{courses?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Total Students</p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {enrollments?.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">Certificates Issued</p>
                <p className="text-2xl font-bold text-black dark:text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mb-12">
          <EditableProfile profile={profile} />
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">My Created Courses</h2>
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div 
                  key={course.id} 
                  className="flex bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group transition-all hover:shadow-lg"
                >
                  <div className="w-40 h-full relative overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                        {course.title}
                      </h3>
                      <span className="text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded">
                        {course.price > 0 ? `$${course.price}` : 'FREE'}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex gap-3 mt-2">
                      <Link 
                        href={`/courses/${course.id}`} 
                        className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View Course Page <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-16 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white">No courses created yet</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">Start by creating your first course and share your knowledge with the world.</p>
                <Link href="/instructor/courses/new" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 mt-4">
                  Create Your First Course
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
