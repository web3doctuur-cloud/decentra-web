-- 1. CLEANUP: Clear old tables and triggers to start fresh 
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users; 
DROP FUNCTION IF EXISTS public.handle_new_user(); 
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE; 
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS courses CASCADE; 
DROP TABLE IF EXISTS profiles CASCADE; 

-- 2. PROFILES: Create with all Student & Instructor fields 
CREATE TABLE profiles ( 
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY, 
  full_name text, 
  username text UNIQUE, 
  role text CHECK (role IN ('student', 'instructor')) DEFAULT 'student', 
  github_url text, 
  phone_number text, 
  nationality text, 
  wallet_address text, 
  avatar_url text, 
  intended_course text, -- Field for students
  headline text, -- Field for instructors
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) 
); 

-- 3. COURSES: Linked to the Instructor's Profile 
CREATE TABLE courses ( 
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY, 
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL, 
  title text NOT NULL, 
  description text, 
  thumbnail_url text,
  instructor_id uuid REFERENCES profiles(id) ON DELETE SET NULL, 
  instructor_name text, 
  price numeric DEFAULT 0, 
  level text, 
  is_free boolean DEFAULT false,
  job_opportunities text -- New field for job opportunities
); 

-- 4. REVIEWS: Course reviews from students
CREATE TABLE reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(student_id, course_id)
);

-- 5. LESSONS: Individual videos within a course
CREATE TABLE lessons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  youtube_url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 6. ENROLLMENTS: Track which students are in which courses
CREATE TABLE enrollments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(student_id, course_id)
);

-- 7. PROGRESS: Track completed lessons
CREATE TABLE lesson_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(student_id, lesson_id)
);

-- 8. SECURITY (RLS): Profiles 
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY; 
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id); 
CREATE POLICY "Profiles are publicly viewable" ON profiles FOR SELECT USING (true); 
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id); 

-- 9. SECURITY (RLS): Courses 
ALTER TABLE courses ENABLE ROW LEVEL SECURITY; 
CREATE POLICY "Courses are viewable by everyone" ON courses FOR SELECT USING (true); 
CREATE POLICY "Only instructors can create courses" ON courses FOR INSERT WITH CHECK ( 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'instructor') 
); 
CREATE POLICY "Instructors can delete their own courses" ON courses FOR DELETE USING (auth.uid() = instructor_id); 

-- 10. SECURITY (RLS): Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Students can create reviews for courses they are enrolled in" ON reviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM enrollments WHERE student_id = auth.uid() AND course_id = reviews.course_id)
);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = student_id);

-- 11. SECURITY (RLS): Lessons
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lessons are viewable by everyone" ON lessons FOR SELECT USING (true);
CREATE POLICY "Only course instructors can add lessons" ON lessons FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid())
);

-- 12. SECURITY (RLS): Enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can enroll themselves" ON enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);

-- 13. SECURITY (RLS): Progress
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own progress" ON lesson_progress FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can update own progress" ON lesson_progress FOR INSERT WITH CHECK (auth.uid() = student_id);

-- 14. AUTOMATION: The Profile Trigger 
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$ 
BEGIN 
  INSERT INTO public.profiles ( 
    id, 
    full_name, 
    role, 
    username, 
    github_url, 
    wallet_address, 
    intended_course,
    headline,
    avatar_url 
  ) 
  VALUES ( 
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    coalesce(new.raw_user_meta_data->>'role', 'student'), 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'github_url', 
    new.raw_user_meta_data->>'wallet_address', 
    new.raw_user_meta_data->>'intended_course',
    new.raw_user_meta_data->>'headline',
    new.raw_user_meta_data->>'avatar_url' 
  ); 
  RETURN new; 
END; 
$$ LANGUAGE plpgsql SECURITY DEFINER; 

CREATE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Refresh Cache
NOTIFY pgrst, 'reload schema';
