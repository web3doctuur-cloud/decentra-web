import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { GraduationCap, BookOpen, Clock, PlayCircle } from "lucide-react";

export default async function CoursesPage() {
  const supabase = await createClient();
  // Simplified query for better reliability
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses on browse page:', error);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8 pt-24 sm:pt-32">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-white">Browse Courses</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">Learn from the best builders in the ecosystem.</p>
        </header>

        {error ? (
          <div className="p-8 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl border border-red-100 dark:border-red-800 text-center font-bold">
            Failed to load courses. Please try again later.
          </div>
        ) : (courses && courses.length > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link 
                key={course.id} 
                href={`/courses/${course.id}`}
                className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative aspect-video">
                  {course.thumbnail_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-black dark:text-white line-clamp-2 leading-snug">{course.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 leading-relaxed">{course.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <GraduationCap className="w-4 h-4" />
                      <span>{course.instructor?.full_name || course.instructor_name || 'Expert'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <Clock className="w-4 h-4" />
                      <span>{course.level || 'LMS Course'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-24 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-400 mb-6">
              <BookOpen className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">No courses available yet</h3>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto mt-2">Check back soon for new learning opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
}
