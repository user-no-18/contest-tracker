// app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import { sendWelcomeEmail, sendDailyContestDigest } from '@/app/lib/email/emailService';
import { createClient } from '@/app/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current logged-in user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated. Please login first.' 
      }, { status: 401 });
    }

    // Get user's email and name
    const userEmail = user.email!;
    const userName = user.user_metadata?.full_name || 'Test User';

    // Get URL params to choose test type
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('type') || 'welcome';

    let result;

    if (testType === 'welcome') {
      // Test welcome email
      result = await sendWelcomeEmail(userEmail, userName);
      
      return NextResponse.json({
        success: result.success,
        testType: 'Welcome Email',
        recipientEmail: userEmail,
        recipientName: userName,
        messageId: result.messageId,
        message: result.success 
          ? `✅ Welcome email sent successfully to ${userEmail}! Check your inbox (and spam folder).`
          : '❌ Failed to send email. Check server logs.',
        error: result.error || null,
      });
    } 
    else if (testType === 'digest') {
      // Fetch REAL contests from API
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      console.log(`📡 Fetching real contests from: ${appUrl}/api/contests`);

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
     const tomorrow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const upcomingContests = contestsData.contests.filter((contest: any) => {
        const startTime = new Date(contest.start_time);
        return startTime >= now && startTime <= tomorrow;
      });

      console.log(`Found ${upcomingContests.length} contests in next 7 days`);

      if (upcomingContests.length === 0) {
        return NextResponse.json({
          success: true,
          testType: 'Daily Digest Email',
          recipientEmail: userEmail,
          recipientName: userName,
          contestsCount: 0,
          message: '⚠️ No contests starting in the next 24 hours. No email sent (this is expected behavior).',
          hint: 'The system only sends emails when there are actual upcoming contests.',
        });
      }

      // Send email with real contests
      result = await sendDailyContestDigest(userEmail, userName, upcomingContests);
      
      return NextResponse.json({
        success: result.success,
        testType: 'Daily Digest Email',
        recipientEmail: userEmail,
        recipientName: userName,
        contestsCount: upcomingContests.length,
        contests: upcomingContests.map((c: any) => ({
          platform: c.platform,
          title: c.title,
          start_time: c.start_time,
        })),
        messageId: result,
        message: result.success 
          ? `✅ Daily digest sent successfully to ${userEmail} with ${upcomingContests.length} real contest(s)! Check your inbox (and spam folder).`
          : '❌ Failed to send email. Check server logs.',
        error: result || null,
      });
    }
    else {
      return NextResponse.json({
        error: 'Invalid test type. Use ?type=welcome or ?type=digest',
        examples: [
          '/api/test-email?type=welcome',
          '/api/test-email?type=digest',
        ]
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Check your email configuration in .env.local and server logs'
    }, { status: 500 });
  }
}

// Also support POST for testing
export async function POST(request: Request) {
  return GET(request);
}