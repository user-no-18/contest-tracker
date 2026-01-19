// app/api/cron/send-emails/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendDailyContestDigest } from '@/app/lib/email/emailService';

// Create Supabase client with service role (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Add this to your .env.local
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: Request) {
  try {
    // Verify authorization (optional but recommended)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.log('❌ Unauthorized cron request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting daily email cron job...');

    // Step 1: Fetch all users with email notifications enabled
    const { data: users, error: usersError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name, email_notifications')
      .eq('email_notifications', true);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      console.log('⚠️ No users with email notifications enabled');
      return NextResponse.json({ 
        success: true, 
        message: 'No users to send emails to',
        userCount: 0 
      });
    }

    console.log(`📧 Found ${users.length} users with notifications enabled`);

    // Step 2: Fetch upcoming contests (next 24 hours)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const contestsResponse = await fetch(`${appUrl}/api/contests`, {
      cache: 'no-store',
    });

    if (!contestsResponse.ok) {
      throw new Error('Failed to fetch contests');
    }

    const contestsData = await contestsResponse.json();

    if (!contestsData.success) {
      throw new Error('Failed to fetch contests from API');
    }

    // Filter contests starting in next 24 hours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingContests = contestsData.contests.filter((contest: any) => {
      const startTime = new Date(contest.start_time);
      return startTime >= now && startTime <= tomorrow;
    });

    console.log(`🎯 Found ${upcomingContests.length} contests in next 24 hours`);

    // Step 3: Send emails to all users
    const emailResults = {
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[]
    };

    for (const user of users) {
      try {
        console.log(`📤 Sending email to ${user.email}...`);

        const result = await sendDailyContestDigest(
          user.email,
          user.full_name || 'Coder',
          upcomingContests
        );

        if (result.success) {
          emailResults.sent++;
          
          // Log successful email
          await supabaseAdmin.from('email_logs').insert({
            user_id: user.id,
            email_type: 'daily_digest',
            recipient_email: user.email,
            subject: `🔥 ${upcomingContests.length} Contest${upcomingContests.length > 1 ? 's' : ''} Starting Soon!`,
            status: 'sent',
            sent_at: new Date().toISOString(),
            contests_count: upcomingContests.length
          });
        } else if (result.skipped) {
          emailResults.skipped++;
        } else {
          emailResults.failed++;
          emailResults.errors.push(`${user.email}: ${JSON.stringify(result.error)}`);
          
          // Log failed email
          await supabaseAdmin.from('email_logs').insert({
            user_id: user.id,
            email_type: 'daily_digest',
            recipient_email: user.email,
            subject: 'Daily Contest Digest',
            status: 'failed',
            error_message: JSON.stringify(result.error)
          });
        }
      } catch (error) {
        console.error(`❌ Error sending to ${user.email}:`, error);
        emailResults.failed++;
        emailResults.errors.push(`${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log('✅ Email cron job completed');
    console.log(`📊 Results: ${emailResults.sent} sent, ${emailResults.failed} failed, ${emailResults.skipped} skipped`);

    return NextResponse.json({
      success: true,
      message: 'Email cron job completed',
      userCount: users.length,
      contestCount: upcomingContests.length,
      results: emailResults
    });

  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Allow POST for manual testing
export async function POST(request: Request) {
  return GET(request);
}