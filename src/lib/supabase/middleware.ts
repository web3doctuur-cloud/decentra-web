import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // 1. If no user and trying to access dashboard, redirect to login choice
  if (!user && (url.pathname.startsWith('/student') || url.pathname.startsWith('/instructor'))) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. If user exists, handle role-based redirection and protect dashboards
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    // If logged in, don't allow access to auth pages
    if (url.pathname.startsWith('/login') || url.pathname.startsWith('/signup')) {
      url.pathname = role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard'
      return NextResponse.redirect(url)
    }

    // Student trying to access instructor dashboard
    if (role === 'student' && url.pathname.startsWith('/instructor')) {
      url.pathname = '/student/dashboard'
      return NextResponse.redirect(url)
    }

    // Instructor trying to access student dashboard
    if (role === 'instructor' && url.pathname.startsWith('/student')) {
      url.pathname = '/instructor/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
