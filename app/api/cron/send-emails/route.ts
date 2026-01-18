// app/api/cron/send-emails/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendDailyContestDigest } from '@/app/lib/email/emailService';

// Initialize Supabase with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Server-side only key
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting daily email job...');

    // Step 1: Fetch all contests starting in the next 24 hours
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const contestsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/contests`
    );
    const contestsData = await contestsResponse.json();

    if (!contestsData.success) {
      throw new Error('Failed to fetch contests');
    }

    // Filter contests starting in next 24 hours
    const upcomingContests = contestsData.contests.filter((contest: any) => {
      const startTime = new Date(contest.start_time);
      return startTime >= now && startTime <= tomorrow;
    });

    console.log(`Found ${upcomingContests.length} contests in next 24h`);

    if (upcomingContests.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No upcoming contests, no emails sent',
      });
    }

    // Step 2: Fetch all users with email notifications enabled
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, email_notifications')
      .eq('email_notifications', true);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    console.log(`Found ${users?.length || 0} users with notifications enabled`);

    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users with notifications enabled',
      });
    }

    // Step 3: Send emails to each user
    const emailResults = await Promise.allSettled(
      users.map(async (user) => {
        try {
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
            subject: `${upcomingContests.length} Contest${upcomingContests.length > 1 ? 's' : ''} Starting Soon!`,
            status: result.success ? 'sent' : 'failed',
            error_message: result.success ? null : JSON.stringify(result),
            sent_at: result.success ? new Date().toISOString() : null,
          });

          return {
            email: user.email,
            success: result.success,
          };
        } catch (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
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

    console.log(`Email job completed: ${successCount} sent, ${failCount} failed`);

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      emailsSent: successCount,
      emailsFailed: failCount,
      contestsCount: upcomingContests.length,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// For testing purposes only
export async function POST(request: Request) {
  // Allow manual trigger for testing
  return GET(request);
}