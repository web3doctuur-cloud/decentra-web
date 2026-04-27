import Link from "next/link";
import { 
  GraduationCap, 
  Wallet, 
  ShieldCheck, 
  Rocket, 
  Star, 
  Briefcase, 
  BookOpen, 
  CirclePlay, 
  ArrowRight, 
  Layers, 
  Zap, 
  Users,
  CheckCircle2,
  Trophy
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch featured courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .limit(3)
    .order('created_at', { ascending: false });

  // Fetch recent reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('*, profiles!student_id(full_name, avatar_url), courses(title)')
    .limit(3)
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#020617] font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold">
              <Zap className="w-4 h-4 fill-current" />
              <span>Future of Decentralized Learning</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Web3</span> <br />
              Beyond Limits
            </h1>
            
            <p className="max-w-xl text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              DecentraWeb is the first truly decentralized LMS. Learn from world-class developers, 
              earn verifiable on-chain credentials, and secure your career in the new internet.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link 
                href="/courses" 
                className="group flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all w-full sm:w-auto shadow-xl shadow-blue-500/25 hover:-translate-y-1 active:scale-[0.98]"
              >
                Start Learning <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/docs" 
                className="flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition-all w-full sm:w-auto hover:-translate-y-1 active:scale-[0.98]"
              >
                View Documentation
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">12k+</p>
                <p className="text-sm text-slate-500">Students</p>
              </div>
              <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">450+</p>
                <p className="text-sm text-slate-500">NFTs Minted</p>
              </div>
              <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">98%</p>
                <p className="text-sm text-slate-500">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-[40px] opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Using the generated image here */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/decentra_hero_banner_1777269760699.png" 
                alt="DecentraWeb Dashboard" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
            </div>
            
            {/* Floating UI Elements */}
            <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-bounce-slow">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</p>
                  <p className="text-sm font-black text-green-500 italic">Verified On-Chain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm">Benefits</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">Why Learn on DecentraWeb?</h3>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400">Our platform is built on the core principles of Web3: ownership, transparency, and rewards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <ShieldCheck className="w-6 h-6" />, 
                title: "On-Chain Certs", 
                desc: "Verifiable NFT certificates that live on your wallet forever.",
                color: "blue"
              },
              { 
                icon: <Wallet className="w-6 h-6" />, 
                title: "Direct Access", 
                desc: "Connect your wallet and start learning immediately. No middlemen.",
                color: "indigo"
              },
              { 
                icon: <Zap className="w-6 h-6" />, 
                title: "Learn to Earn", 
                desc: "Complete challenges and earn platform tokens and rewards.",
                color: "blue"
              },
              { 
                icon: <Users className="w-6 h-6" />, 
                title: "Expert Network", 
                desc: "Learn from real developers building the next big dApps.",
                color: "indigo"
              }
            ].map((benefit, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/5">
                <div className={`w-14 h-14 rounded-2xl bg-${benefit.color}-500/10 flex items-center justify-center text-${benefit.color}-600 dark:text-${benefit.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{benefit.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Functions / How it Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-12">
              <div className="space-y-4">
                <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm">Functions</h2>
                <h3 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">Advanced Platform <br />Features</h3>
              </div>

              <div className="space-y-8">
                {[
                  { 
                    icon: <Layers className="w-6 h-6" />, 
                    title: "Smart Course Management", 
                    desc: "Instructors manage content via decentralized storage and smart contracts." 
                  },
                  { 
                    icon: <CheckCircle2 className="w-6 h-6" />, 
                    title: "Automated NFT Minting", 
                    desc: "Finish a course, and your NFT certificate is minted instantly to your connected wallet." 
                  },
                  { 
                    icon: <Users className="w-6 h-6" />, 
                    title: "Community Governance", 
                    desc: "Vote on which courses should be added next using platform tokens." 
                  }
                ].map((func, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                      {func.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">{func.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{func.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="aspect-[4/5] bg-blue-600 rounded-3xl p-8 flex flex-col justify-end text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 scale-150">
                    <GraduationCap className="w-32 h-32" />
                   </div>
                   <h5 className="text-2xl font-black leading-tight">Secure <br />Learning</h5>
                </div>
                <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-50 dark:opacity-30" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-50 dark:opacity-30" />
                </div>
                <div className="aspect-[4/5] bg-indigo-600 rounded-3xl p-8 flex flex-col justify-end text-white relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 scale-150">
                    <Wallet className="w-32 h-32" />
                   </div>
                   <h5 className="text-2xl font-black leading-tight">Instant <br />Payments</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-4">
              <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm">Courses</h2>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">Explore Top Curriculums</h3>
            </div>
            <Link href="/courses" className="text-blue-600 font-bold flex items-center gap-2 group">
              Browse all courses <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(courses && courses.length > 0) ? (
              courses.map((course) => (
                <div 
                   key={course.id} 
                  className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col"
                >
                  <div className="relative aspect-video m-2 rounded-[2rem] overflow-hidden">
                    {course.thumbnail_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-500">
                      <div className="w-14 h-14 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                        <CirclePlay className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                        {course.level || 'Featured'}
                      </span>
                      <span className="text-xl font-black text-blue-600">{course.price > 0 ? `$${course.price}` : 'FREE'}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight group-hover:text-blue-600 transition-colors">{course.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed flex-1">{course.description}</p>
                    
                    <div className="flex items-center gap-3 py-4 border-y border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center font-bold text-blue-600">
                        {course.instructor?.full_name?.charAt(0) || 'E'}
                      </div>
                      <div className="text-sm">
                        <p className="font-bold text-slate-900 dark:text-white">{course.instructor?.full_name || course.instructor_name || 'Expert Instructor'}</p>
                        <p className="text-slate-500">Web3 Specialist</p>
                      </div>
                    </div>

                    <Link 
                      href="/login" 
                      className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-center hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-slate-500">No courses available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm">Success Stories</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">What Our Builders Say</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-left space-y-6 relative group hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-2xl">
                  <div className="flex gap-1 text-yellow-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic text-lg leading-relaxed">&quot;{review.comment}&quot;</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden font-bold text-white">
                      {review.profiles?.avatar_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={review.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        review.profiles?.full_name?.charAt(0) || 'S'
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{review.profiles?.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{review.courses?.title || 'Student'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [
                { name: "Alex Rivers", role: "Frontend Dev", text: "The on-chain certifications helped me land my first Web3 gig! Highly recommend DecentraWeb.", rating: 5 },
                { name: "Sarah Chen", role: "Solidity Engineer", text: "The best structured curriculum for blockchain development I've found so far.", rating: 5 },
                { name: "Marcus Wright", role: "Student", text: "I love the learn-to-earn model. It keeps me motivated to complete the courses.", rating: 4 }
              ].map((fallback, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-left space-y-6 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-2xl">
                  <div className="flex gap-1 text-yellow-500">
                    {[...Array(fallback.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic text-lg leading-relaxed">&quot;{fallback.text}&quot;</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                      {fallback.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{fallback.name}</p>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{fallback.role}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[3rem] bg-blue-600 p-12 lg:p-24 overflow-hidden text-center text-white">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-white rounded-full blur-[120px]" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl lg:text-6xl font-black leading-tight">Ready to Build the Future?</h2>
              <p className="text-xl text-blue-50 leading-relaxed opacity-90">
                Join 12,000+ builders already learning on the decentralized web. 
                Get certified, earn rewards, and secure your place in the Web3 ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link 
                  href="/signup" 
                  className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all shadow-2xl active:scale-[0.98]"
                >
                  Join DecentraWeb Now
                </Link>
                <Link 
                  href="/courses" 
                  className="px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all active:scale-[0.98]"
                >
                  Explore Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">D</div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">DecentraWeb</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 DecentraWeb. All rights reserved on-chain.</p>
          <div className="flex gap-8 text-sm font-bold text-slate-900 dark:text-white">
            <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms</Link>
            <Link href="/docs" className="hover:text-blue-600">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}