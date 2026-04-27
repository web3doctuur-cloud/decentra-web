import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, LayoutDashboard, BookOpen, Users, Mail, Calendar, ArrowLeft } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { SignOutButton } from "@/components/sign-out-button";

export default async function InstructorStudentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch enrollments for courses owned by this instructor
  // We use !inner to filter by the related table's instructor_id
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select(`
      id,
      created_at,
      courses!inner (
        title,
        instructor_id
      ),
      profiles (
        id,
        full_name,
        username,
        avatar_url
      )
    `)
    .eq('courses.instructor_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching students:', error);
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-black dark:text-white">DecentraWeb</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/instructor/dashboard" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/instructor/courses" className="flex items-center gap-3 px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <BookOpen className="w-5 h-5" />
            My Courses
          </Link>
          <Link href="/instructor/students" className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-semibold">
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
        <div className="mb-8">
          <Link href="/instructor/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors mb-4 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <DashboardHeader 
            title="My Students" 
            subtitle="Manage and track progress of students enrolled in your courses." 
          />
        </div>

        {/* Students Table Section */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          {enrollments && enrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-4 text-sm font-bold text-zinc-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-sm font-bold text-zinc-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-sm font-bold text-zinc-500 uppercase tracking-wider">Enrolled On</th>
                    <th className="px-6 py-4 text-sm font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {enrollments.map((enrollment: any) => (
                    <tr key={enrollment.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center overflow-hidden border border-blue-200/50 dark:border-blue-800/50">
                            {enrollment.profiles?.avatar_url ? (
                              <img src={enrollment.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-bold text-blue-600">{enrollment.profiles?.full_name?.charAt(0) || 'S'}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-black dark:text-white">{enrollment.profiles?.full_name || 'Anonymous Student'}</p>
                            <p className="text-xs text-zinc-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> @{enrollment.profiles?.username || 'user'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-zinc-400" />
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">{enrollment.courses?.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-zinc-500 text-sm">
                          <Calendar className="w-4 h-4" />
                          {new Date(enrollment.created_at).toLocaleDateString(undefined, { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95">
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white">No students yet</h3>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">When students enroll in your courses, they will appear here with their details and enrollment dates.</p>
              <Link href="/instructor/dashboard" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-4">
                Back to Dashboard
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
