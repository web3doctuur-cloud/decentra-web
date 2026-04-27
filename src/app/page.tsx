<<<<<<< HEAD
import Link from "next/link";
import { GraduationCap, Wallet, ShieldCheck, Rocket, Star, Briefcase, BookOpen, PlayCircle, ArrowRight } from "lucide-react";
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

  // Debug log to see what data is actually coming back
  console.log('Courses fetched:', courses?.length, 'Instructor details present:', courses?.[0]?.instructor ? 'Yes' : 'No');

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
                      <PlayCircle className="w-12 h-12 text-white" />
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

      
=======
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CourseCard from "@/components/ui/CourseCard";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { 
  FaStar, 
  FaUsers, 
  FaChalkboardTeacher, 
  FaAward, 
  FaEthereum,
  FaQuoteLeft,
  FaArrowRight
} from "react-icons/fa";

interface Review {
  id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  comment: string;
  course_title: string;
  created_at: string;
}

interface Stat {
  label: string;
  value: number;
  icon: JSX.Element;
}

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stat[]>([
    { label: "Students Enrolled", value: 0, icon: <FaUsers /> },
    { label: "Expert Instructors", value: 0, icon: <FaChalkboardTeacher /> },
    { label: "Courses Available", value: 0, icon: <FaAward /> },
    { label: "ETH Earned by Creators", value: 0, icon: <FaEthereum /> }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (!coursesError && coursesData) {
        setCourses(coursesData);
        
        // Update stats with real data
        setStats(prev => prev.map(stat => {
          if (stat.label === "Courses Available") return { ...stat, value: coursesData.length };
          if (stat.label === "Expert Instructors") {
            const uniqueInstructors = new Set(coursesData.map(c => c.instructor_id)).size;
            return { ...stat, value: uniqueInstructors };
          }
          return stat;
        }));
      }

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!reviewsError && reviewsData) {
        const formattedReviews = reviewsData.map((review: any) => ({
          id: review.id,
          user_name: review.profiles?.full_name || "Anonymous",
          user_avatar: review.profiles?.avatar_url || "",
          rating: review.rating,
          comment: review.comment,
          course_title: review.course_title || "Course",
          created_at: review.created_at
        }));
        setReviews(formattedReviews);
        
        // Update student count stat (approximate from reviews + enrollments)
        const { count: enrollmentsCount } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true });
          
        setStats(prev => prev.map(stat => 
          stat.label === "Students Enrolled" ? { ...stat, value: enrollmentsCount || 0 } : stat
        ));
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-slate-600'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/30 mb-6">
              <span className="text-purple-400 text-sm font-mono">⚡ Decentralized Learning</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Learn Web3<br />On the Blockchain
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Join the future of education with decentralized courses, NFT certificates, and direct payments to instructors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-white transition-all transform hover:scale-105">
                  Explore Courses
                </button>
              </Link>
              <Link href="/instructor/signup">
                <button className="px-8 py-3 border-2 border-purple-500/50 hover:border-purple-500 rounded-lg font-bold text-purple-400 hover:text-purple-300 transition-all">
                  Become an Instructor
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 border-y border-purple-500/20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl text-purple-500 mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value.toLocaleString()}+
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Featured Courses
              </h2>
              <p className="text-slate-400">Hand-picked by our community</p>
            </div>
            <Link href="/courses" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
              View all <FaArrowRight className="text-sm" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.slice(0, 6).map((course) => (
                <CourseCard 
                  key={course.id} 
                  id={course.id}
                  title={course.title}
                  instructor={course.instructor_name || "Unknown Instructor"}
                  price={course.price}
                  level={course.level}
                  thumbnail={course.thumbnail_url}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-500">No courses available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Student Reviews Section */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Students Say
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Join thousands of satisfied learners who have transformed their careers
            </p>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <FaQuoteLeft className="text-purple-500/30 text-3xl mb-4" />
                  <p className="text-slate-300 mb-4 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                        {review.user_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{review.user_name}</p>
                        <p className="text-xs text-slate-500">{review.course_title}</p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">No reviews yet. Be the first to leave a review!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-3xl p-12 border border-purple-500/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-slate-300 mb-8">
              Join the decentralized learning revolution. Get certified, earn crypto, and build the future.
            </p>
            <Link href="/signup">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-white transition-all transform hover:scale-105">
                Get Started Today
              </button>
            </Link>
          </div>
        </div>
      </section>
>>>>>>> ff84ecb7f40cd6cf9354e7c60995bdfe8c7f6304
    </div>
  );
}