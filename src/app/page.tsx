import Link from "next/link";
import { GraduationCap, Wallet, ShieldCheck, Rocket, Star, Briefcase, BookOpen, CirclePlay, ArrowRight } from "lucide-react";

import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch a few featured courses - Simplified query for better reliability
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .limit(3)
    .order('created_at', { ascending: false });

  if (coursesError) {
    console.error('Error fetching courses:', coursesError);
  }

  // Fetch recent reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('*, profiles!student_id(full_name, avatar_url), courses(title)')
    .limit(3)
    .order('created_at', { ascending: false });

  if (reviewsError) {
    console.error('Error fetching reviews:', reviewsError);
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-100 dark:border-blue-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Decentralized Education is Here
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-black dark:text-white">
            Empowering Builders Through <span className="text-blue-600">Web3 Learning</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            DecentraWeb is a decentralized LMS where you can learn blockchain development, 
            earn NFT certifications, and build the future of the web.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/courses" 
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-colors w-full sm:w-auto shadow-lg shadow-blue-500/20"
            >
              Browse All Courses <Rocket className="w-5 h-5" />
            </Link>
            <Link 
              href="/docs" 
              className="flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors w-full sm:w-auto"
            >
              View Docs
            </Link>
          </div>
        </div>

        {/* Featured Courses Section */}
        <div className="max-w-6xl mx-auto mt-32 px-4 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left gap-4">
            <div>
              <h2 className="text-3xl font-bold text-black dark:text-white">Featured Courses</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">Start your journey with our top-rated programs.</p>
            </div>
            <Link href="/courses" className="text-blue-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(courses && courses.length > 0) ? (
              courses.map((course) => (
                <div 
                   key={course.id} 
                  className="group bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
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
                      <CirclePlay className="w-12 h-12 text-white" />
                    </div>

                  </div>
                  
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-black dark:text-white line-clamp-1 leading-snug">{course.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 leading-relaxed flex-1">{course.description}</p>
                    
                    {/* Job Opportunity Field */}
                    {course.job_opportunities && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/50">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                          <Briefcase className="w-3 h-3" /> Job Opportunities
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300 text-xs line-clamp-2 italic">
                          &quot;{course.job_opportunities}&quot;
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
                        <GraduationCap className="w-4 h-4" />
                        <span>{course.instructor?.full_name || course.instructor_name || 'Expert'}</span>
                      </div>
                      <span className="text-sm font-bold text-blue-600">{course.price > 0 ? `$${course.price}` : 'FREE'}</span>
                    </div>

                    <Link 
                      href="/login" 
                      className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-center hover:opacity-90 transition-opacity"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500">No courses available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-6xl mx-auto mt-32 px-4 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white">What Our Students Say</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">Join thousands of builders learning on DecentraWeb.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-left space-y-4">
                  <div className="flex gap-1 text-yellow-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 italic">&quot;{review.comment}&quot;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                      {review.profiles?.avatar_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={review.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-zinc-500">{review.profiles?.full_name?.charAt(0) || 'S'}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black dark:text-white">{review.profiles?.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-zinc-500">{review.courses?.title || 'Course'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback reviews if database is empty
              [
                { name: "Alex Rivers", role: "Frontend Dev", text: "The on-chain certifications helped me land my first Web3 gig! Highly recommend DecentraWeb.", rating: 5 },
                { name: "Sarah Chen", role: "Solidity Engineer", text: "The best structured curriculum for blockchain development I've found so far.", rating: 5 },
                { name: "Marcus Wright", role: "Student", text: "I love the learn-to-earn model. It keeps me motivated to complete the courses.", rating: 4 }
              ].map((fallback, i) => (
                <div key={i} className="p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-left space-y-4">
                  <div className="flex gap-1 text-yellow-500">
                    {[...Array(fallback.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-zinc-700 dark:text-zinc-300 italic">&quot;{fallback.text}&quot;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 text-xs">
                      {fallback.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black dark:text-white">{fallback.name}</p>
                      <p className="text-xs text-zinc-500">{fallback.role}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-32 px-4">
          <div className="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-left space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white">On-Chain Credentials</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Verifiable NFT certificates for every course you complete, stored permanently on the blockchain.</p>
          </div>
          
          <div className="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-left space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white">Learn to Earn</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Unlock opportunities and earn rewards as you master new skills in decentralized technologies.</p>
          </div>

          <div className="p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-left space-y-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white">Expert-Led Courses</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Curated curriculum from the best developers in the ecosystem, covering Next.js, Solidity, and more.</p>
          </div>
        </div>
      </main>
    </div>
  );
}