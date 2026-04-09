"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FaVideo, 
  FaUsers, 
  FaEthereum, 
  FaChartLine, 
  FaEdit, 
  FaTrash, 
  FaPlus 
} from "react-icons/fa";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  thumbnail_url: string;
  created_at: string;
  enrollment_count?: number;
  enrollments?: any[];
}

export default function InstructorDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatsAndCourses();
  }, []);

  const fetchStatsAndCourses = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/instructor/login");
      return;
    }
    
    // Fetch courses with enrollment counts
    const { data: coursesData, error } = await supabase
      .from('courses')
      .select(`
        *,
        enrollments (count)
      `)
      .eq('instructor_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
      return;
    }

    if (coursesData) {
      // Add enrollment count to each course
      const coursesWithCount = coursesData.map((course: any) => ({
        ...course,
        enrollment_count: course.enrollments?.[0]?.count || 0
      }));
      
      setCourses(coursesWithCount);
      
      // Calculate stats
      const totalStudents = coursesWithCount.reduce((sum, c) => sum + (c.enrollment_count || 0), 0);
      const totalRevenue = coursesWithCount.reduce((sum, c) => sum + (c.price || 0), 0);
      
      setStats({
        totalCourses: coursesWithCount.length,
        totalStudents,
        totalRevenue,
      });
    }
    
    setLoading(false);
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/instructor/edit/${courseId}`);
  };

  const deleteCourse = async (courseId: string) => {
    const confirmDelete = confirm("⚠️ Are you sure? This will permanently delete the course and all student enrollments.");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      // Update local state
      setCourses(courses.filter(c => c.id !== courseId));
      // Update stats
      setStats(prev => ({
        ...prev,
        totalCourses: prev.totalCourses - 1
      }));
      alert("✅ Course deleted successfully!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-slate-400">Here's what's happening with your courses</p>
        </div>
        <Link href="/instructor/create">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2">
            <FaPlus /> Create New Course
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Courses</p>
                <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
              </div>
              <FaVideo className="text-3xl text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
              </div>
              <FaUsers className="text-3xl text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-green-400">{stats.totalRevenue} ETH</p>
              </div>
              <FaEthereum className="text-3xl text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses List */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Your Courses</h2>
        
        {courses.length > 0 ? (
          <div className="grid gap-4">
            {courses.map((course) => (
              <Card key={course.id} className="bg-slate-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all overflow-hidden group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Thumbnail */}
                      <div className="h-20 w-32 bg-gradient-to-br from-purple-900/30 to-slate-900 rounded-lg border border-purple-500/30 flex items-center justify-center overflow-hidden">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
                        ) : (
                          <FaVideo className="text-3xl text-purple-500/50" />
                        )}
                      </div>
                      
                      {/* Course Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg group-hover:text-purple-400 transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                            {course.price} ETH
                          </span>
                          <span className="text-xs text-slate-400">
                            {course.level || "Beginner"}
                          </span>
                          <span className="text-xs text-blue-400">
                            📚 {course.enrollment_count || 0} students
                          </span>
                          <span className="text-xs text-slate-500">
                            📅 {new Date(course.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleEditCourse(course.id)}
                        variant="outline" 
                        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </Button>
                      <Button 
                        onClick={() => deleteCourse(course.id)}
                        variant="destructive"
                        className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-purple-500/30 rounded-3xl bg-slate-900/30">
            <FaVideo className="text-5xl text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">You haven't created any courses yet.</p>
            <p className="text-slate-500 text-sm mt-2">Click "Create New Course" to get started</p>
            <Link href="/instructor/create">
              <Button className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600">
                <FaPlus className="mr-2" /> Create Your First Course
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}