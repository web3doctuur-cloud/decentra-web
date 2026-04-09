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
    </div>
  );
}