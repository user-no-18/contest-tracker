// app/lib/email/emailService.ts
import nodemailer from 'nodemailer';

interface Contest {
  platform: string;
  title: string;
  url: string;
  start_time: string;
  duration: number;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create transporter with better error handling
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // Add these for better reliability
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
    logger: false, // Set to true for debugging
    debug: false, // Set to true for debugging
  });
}

// Verify email configuration on startup
export async function verifyEmailConfig() {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error);
    return false;
  }
}

// Send email with retry logic
export async function sendEmail({ to, subject, html }: EmailOptions, retries = 3) {
  let lastError: any;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const transporter = createTransporter();
      
      console.log(`📧 Attempt ${attempt}/${retries} - Sending email to ${to}`);

      const info = await transporter.sendMail({
        from: `"DSA Quest" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      console.log(`✅ Email sent successfully: ${info.messageId} to ${to}`);
      
      // Close transporter connection
      transporter.close();
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      lastError = error;
      console.error(`❌ Email send attempt ${attempt} failed:`, error);
      
      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`⏳ Waiting ${waitTime/1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.error(`❌ All ${retries} email attempts failed for ${to}`);
  return { success: false, error: lastError };
}

// Format duration helper
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
}

// Format date helper
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format time helper
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Generate contest email HTML
function generateContestEmailHTML(contests: Contest[], userName: string): string {
  if (!contests || contests.length === 0) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>No Upcoming Contests</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🎯 DSA Quest</h1>
          </div>
          <div style="padding: 40px; text-align: center;">
            <h2 style="color: #1f2937; margin: 0 0 16px 0;">Hey ${userName}! 👋</h2>
            <p style="color: #6b7280; font-size: 16px;">No contests starting in the next 24 hours. Take this time to practice and prepare! 💪</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  const contestRows = contests
    .map(
      (contest) => `
        <div style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 16px; background: #ffffff;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="display: inline-block; background: #3b82f6; color: white; padding: 6px 12px; border-radius: 8px; font-weight: bold; font-size: 12px;">
              ${contest.platform}
            </span>
          </div>
          
          <h3 style="margin: 0 0 12px 0; font-size: 18px; color: #1f2937; font-weight: bold;">
            ${contest.title}
          </h3>
          
          <div style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
            <div style="color: #6b7280; font-size: 14px;">
              📅 ${formatDate(contest.start_time)}
            </div>
            <div style="color: #6b7280; font-size: 14px;">
              🕐 ${formatTime(contest.start_time)}
            </div>
            <div style="color: #6b7280; font-size: 14px;">
              ⏱️ ${formatDuration(contest.duration)}
            </div>
          </div>
          
          <a href="${contest.url}" 
             style="display: inline-block; background: #10b981; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
            Join Contest →
          </a>
        </div>
      `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Upcoming Contests - DSA Quest</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
      <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">
            🚀 DSA Quest
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">
            Your Daily Contest Digest
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 20px;">
          <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 8px 0; font-weight: bold;">
            Hey ${userName}! 👋
          </h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
            Here ${contests.length === 1 ? 'is' : 'are'} <strong>${contests.length} contest${contests.length > 1 ? 's' : ''}</strong> starting in the next <strong>24 hours</strong>. Time to sharpen those algorithms! 💪
          </p>

          <!-- Contests List -->
          ${contestRows}

          <!-- Tips Section -->
          <div style="margin-top: 32px; padding: 20px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
            <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 18px; font-weight: bold;">
              💡 Quick Tips
            </h3>
            <ul style="color: #78350f; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Review patterns you've practiced recently</li>
              <li>Check contest rules and scoring system</li>
              <li>Keep your editor and templates ready</li>
              <li>Stay hydrated and take breaks between problems</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 2px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px 0;">
            Happy Coding! May your solutions be optimal and your submissions be accepted! ✨
          </p>
          <div style="margin-bottom: 16px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-right: 8px;">
              View Dashboard
            </a>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/resources" 
               style="display: inline-block; background: #6b7280; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Study Resources
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            You're receiving this because you enabled contest notifications in DSA Quest.<br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color: #3b82f6; text-decoration: none;">
              Update preferences
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send daily contest digest
export async function sendDailyContestDigest(
  userEmail: string,
  userName: string,
  contests: Contest[]
) {
  console.log(`📧 Preparing email for ${userEmail} with ${contests.length} contests`);

  if (!contests || contests.length === 0) {
    console.log(`⚠️ No contests for ${userEmail}, skipping email`);
    return { success: true, skipped: true };
  }

  const subject = `🔥 ${contests.length} Contest${contests.length > 1 ? 's' : ''} Starting Soon!`;
  const html = generateContestEmailHTML(contests, userName);

  console.log(`📤 Sending email to ${userEmail}: ${subject}`);
  
  const result = await sendEmail({ to: userEmail, subject, html });
  
  if (result.success) {
    console.log(`✅ Email sent successfully to ${userEmail}`);
  } else {
    console.error(`❌ Failed to send email to ${userEmail}:`, result.error);
  }
  
  return result;
}

// Send welcome email
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const subject = "Welcome to DSA Quest! 🚀";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to DSA Quest</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 36px;">🎉 Welcome!</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #1f2937; margin: 0 0 16px 0;">Hey ${userName}!</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Welcome to <strong>DSA Quest</strong> - your ultimate platform for tracking coding contests and mastering algorithms!
          </p>
          <div style="margin: 32px 0; padding: 24px; background: #eff6ff; border-radius: 12px;">
            <h3 style="color: #1e40af; margin: 0 0 16px 0;">What's Next?</h3>
            <ul style="color: #1e3a8a; margin: 0; padding-left: 20px; line-height: 2;">
              <li>Get daily email digests of upcoming contests</li>
              <li>Track your favorite platforms (LeetCode, Codeforces, CodeChef)</li>
              <li>Access curated DSA resources and roadmaps</li>
              <li>Monitor your coding journey and progress</li>
            </ul>
          </div>
          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Go to Dashboard →
            </a>
          </div>
        </div>
        <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Happy Coding! 💻<br>
            Team DSA Quest
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: userEmail, subject, html });
}