import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  'use server'

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const type = formData.get('type') as string || 'student'

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    let errorMessage = error.message
    if (errorMessage === 'Invalid login credentials') {
      errorMessage = 'Invalid login credentials. Please verify your password or check your email to confirm your account.'
    }
    redirect(`/login/${type}?error=` + encodeURIComponent(errorMessage))
  }

  // Fetch role from profiles table (source of truth)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profile?.role === 'instructor') {
    redirect('/instructor/dashboard')
  } else {
    redirect('/student/dashboard')
  }
}

export async function signup(formData: FormData) {
  'use server'

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const username = formData.get('username') as string
  const role = formData.get('role') as string // 'student' or 'instructor'
  
  // Additional fields for student
  const github_url = formData.get('github_url') as string
  const wallet_address = formData.get('wallet_address') as string
  const intended_course = formData.get('intended_course') as string

  // Additional fields for instructor
  const headline = formData.get('headline') as string
  
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        username,
        role,
        github_url,
        wallet_address,
        intended_course,
        headline,
      },
    },
  })

  if (error) {
    redirect('/signup?error=' + error.message)
  }

  // Redirect based on role immediately
  if (role === 'instructor') {
    redirect('/instructor/dashboard')
  } else {
    redirect('/student/dashboard')
  }
}
