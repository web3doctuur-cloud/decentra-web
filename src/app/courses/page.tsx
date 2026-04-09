"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FaEthereum, FaUserGraduate, FaBookOpen } from "react-icons/fa";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  instructor_name: string;
  thumbnail_url: string;
  total_chapters: number;
}

export default function BrowseCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      console.log("Fetched courses:", data); // Debug: log courses
      setCourses(data);
    }
    setLoading(false);
  };

  const filteredCourses = courses.filter(course => {
    if (filter === "free") return course.price === 0;
    if (filter === "premium") return course.price > 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Browse Courses
        </h1>
        <p className="text-slate-400 mb-8">Discover decentralized learning opportunities</p>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setFilter("free")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "free" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Free
          </button>
          <button
            onClick={() => setFilter("premium")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "premium" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Premium
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link 
                href={`/courses/${course.id}`} 
                key={course.id}
                onClick={() => console.log("Navigating to course:", course.id)} // Debug
              >
                <div className="bg-slate-900/50 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:transform hover:scale-105 duration-300 cursor-pointer">
                  {course.thumbnail_url && (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-xl text-white">{course.title}</h3>
                      <span className="text-sm font-bold text-purple-400 flex items-center">
                        <FaEthereum className="mr-1" /> {course.price}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1"><FaUserGraduate /> {course.instructor_name}</span>
                      <span className="flex items-center gap-1"><FaBookOpen /> {course.total_chapters || 0} lessons</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-slate-400">No courses found.</p>
          </div>
        )}
      </div>
    </div>
  );
}