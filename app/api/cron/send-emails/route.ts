import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { sendWelcomeEmail } from '@/app/lib/email/emailService'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Handle cookie setting errors
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Handle cookie removal errors
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      // Check if this is a new user (first time login)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('created_at')
        .eq('id', data.user.id)
        .single()

      // If profile was just created (within last 10 seconds), send welcome email
      if (profile) {
        const createdAt = new Date(profile.created_at)
        const now = new Date()
        const secondsSinceCreation = (now.getTime() - createdAt.getTime()) / 1000

        // If account is less than 10 seconds old, it's a new user
        if (secondsSinceCreation < 10) {
          console.log('🎉 New user detected! Sending welcome email...')
          
          const userEmail = data.user.email!
          const userName = data.user.user_metadata?.full_name || 'Coder'

          // Send welcome email (don't wait for it)
          sendWelcomeEmail(userEmail, userName)
            .then((result) => {
              if (result.success) {
                console.log(`✅ Welcome email sent to ${userEmail}`)
                
                // Log in database
                supabase.from('email_logs').insert({
                  user_id: data.user.id,
                  email_type: 'welcome',
                  recipient_email: userEmail,
                  subject: 'Welcome to DSA Quest! 🚀',
                  status: 'sent',
                  sent_at: new Date().toISOString(),
                })
              } else {
                console.error(`❌ Failed to send welcome email to ${userEmail}`)
                
                // Log failure
                supabase.from('email_logs').insert({
                  user_id: data.user.id,
                  email_type: 'welcome',
                  recipient_email: userEmail,
                  subject: 'Welcome to DSA Quest! 🚀',
                  status: 'failed',
                  error_message: JSON.stringify(result.error),
                })
              }
            })
            .catch((err) => {
              console.error('❌ Welcome email error:', err)
            })
        } else {
          console.log('👤 Existing user logging in, no welcome email sent')
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.error('Auth callback error:', error)
    }
  }

  // Return to error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}