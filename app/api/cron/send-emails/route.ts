// app/api/cron/send-emails/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendDailyContestDigest } from '@/app/lib/email/emailService';

// Initialize Supabase with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('❌ Unauthorized cron access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting daily email job...');

    // Step 1: Fetch all contests from your API
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    console.log(`📡 Fetching contests from: ${appUrl}/api/contests`);

    const contestsResponse = await fetch(`${appUrl}/api/contests`, {
      cache: 'no-store',
    });

    if (!contestsResponse.ok) {
      throw new Error(`Failed to fetch contests: ${contestsResponse.status}`);
    }

    const contestsData = await contestsResponse.json();

    if (!contestsData.success) {
      throw new Error('Failed to fetch contests from API');
    }

    console.log(`📊 Total contests fetched: ${contestsData.contests.length}`);

    // Step 2: Filter contests starting in the next 24 hours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingContests = contestsData.contests.filter((contest: any) => {
      const startTime = new Date(contest.start_time);
      return startTime >= now && startTime <= tomorrow;
    });

    console.log(`⏰ Contests in next 24 hours: ${upcomingContests.length}`);

    if (upcomingContests.length === 0) {
      console.log('⚠️ No upcoming contests, no emails will be sent');
      return NextResponse.json({
        success: true,
        message: 'No upcoming contests, no emails sent',
        contestsCount: 0,
        emailsSent: 0,
      });
    }

    // Log contest details
    upcomingContests.forEach((contest: any, index: number) => {
      console.log(`  ${index + 1}. [${contest.platform}] ${contest.title} - ${new Date(contest.start_time).toLocaleString()}`);
    });

    // Step 3: Fetch all users with email notifications enabled
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, email_notifications')
      .eq('email_notifications', true);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      throw usersError;
    }

    console.log(`👥 Found ${users?.length || 0} users with notifications enabled`);

    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users with notifications enabled',
        contestsCount: upcomingContests.length,
        emailsSent: 0,
      });
    }

    // Step 4: Send emails to each user
    const emailResults = await Promise.allSettled(
      users.map(async (user) => {
        try {
          console.log(`📧 Sending email to: ${user.email}`);

          const result = await sendDailyContestDigest(
            user.email,
            user.full_name || 'Coder',
            upcomingContests
          );

          // Log email in database
          await supabase.from('email_logs').insert({
            user_id: user.id,
            email_type: 'daily_digest',
            recipient_email: user.email,
            subject: `🔥 ${upcomingContests.length} Contest${upcomingContests.length > 1 ? 's' : ''} Starting Soon!`,
            status: result.success ? 'sent' : 'failed',
            error_message: result.success ? null : JSON.stringify(result),
            sent_at: result.success ? new Date().toISOString() : null,
          });

          return {
            email: user.email,
            success: result.success,
          };
        } catch (error) {
          console.error(`❌ Failed to send email to ${user.email}:`, error);
          
          // Log failed email
          await supabase.from('email_logs').insert({
            user_id: user.id,
            email_type: 'daily_digest',
            recipient_email: user.email,
            subject: `🔥 ${upcomingContests.length} Contest${upcomingContests.length > 1 ? 's' : ''} Starting Soon!`,
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            sent_at: null,
          });

          return {
            email: user.email,
            success: false,
            error,
          };
        }
      })
    );

    const successCount = emailResults.filter(
      (r) => r.status === 'fulfilled' && r.value.success
    ).length;
    const failCount = emailResults.length - successCount;

    console.log(`✅ Email job completed: ${successCount} sent, ${failCount} failed`);

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      emailsSent: successCount,
      emailsFailed: failCount,
      contestsCount: upcomingContests.length,
      contests: upcomingContests.map((c: any) => ({
        platform: c.platform,
        title: c.title,
        start_time: c.start_time,
      })),
    });
  } catch (error) {
    console.error('❌ Cron job error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// For testing purposes
export async function POST(request: Request) {
  return GET(request);
}