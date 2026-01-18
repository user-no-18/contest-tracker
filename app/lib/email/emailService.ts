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

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify transporter configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email service is ready');
    return true;
  } catch (error) {
    console.error('Email service error:', error);
    return false;
  }
}

// Send email function
export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"DSA Quest" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

// Format duration helper
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Generate contest email HTML
function generateContestEmailHTML(contests: Contest[], userName: string): string {
  const contestRows = contests
    .map(
      (contest) => `
    <tr style="border-bottom: 2px solid #e5e7eb;">
      <td style="padding: 16px;">
        <div style="display: inline-block; background: #3b82f6; color: white; padding: 4px 12px; border-radius: 12px; font-weight: bold; font-size: 12px;">
          ${contest.platform}
        </div>
      </td>
      <td style="padding: 16px;">
        <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">
          ${contest.title}
        </div>
        <div style="color: #6b7280; font-size: 14px;">
          ${new Date(contest.start_time).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </div>
      </td>
      <td style="padding: 16px; color: #6b7280;">
        ${formatDuration(contest.duration)}
      </td>
      <td style="padding: 16px; text-align: center;">
        <a href="${contest.url}" 
           style="background: #10b981; color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
          Join →
        </a>
      </td>
    </tr>
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
      <div style="max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
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
          <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 8px 0;">
            Hey ${userName}! 👋
          </h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
            Here are the contests starting in the next <strong>24 hours</strong>. Time to sharpen those algorithms! 💪
          </p>

          <!-- Contests Table -->
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #f9fafb; border-bottom: 2px solid #e5e7eb;">
                <th style="padding: 12px; text-align: left; font-weight: bold; color: #374151;">Platform</th>
                <th style="padding: 12px; text-align: left; font-weight: bold; color: #374151;">Contest</th>
                <th style="padding: 12px; text-align: left; font-weight: bold; color: #374151;">Duration</th>
                <th style="padding: 12px; text-align: center; font-weight: bold; color: #374151;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${contestRows}
            </tbody>
          </table>

          <!-- Tips Section -->
          <div style="margin-top: 32px; padding: 20px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
            <h3 style="color: #92400e; margin: 0 0 8px 0; font-size: 18px;">
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
               style="background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; margin-right: 8px;">
              View Dashboard
            </a>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/resources" 
               style="background: #6b7280; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              Study Resources
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            You're receiving this because you enabled contest notifications in DSA Quest.<br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #3b82f6; text-decoration: none;">
              Update preferences
            </a> | 
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #3b82f6; text-decoration: none;">
              Unsubscribe
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
  if (contests.length === 0) {
    console.log(`No contests for ${userEmail}, skipping email`);
    return { success: true, skipped: true };
  }

  const subject = `🔥 ${contests.length} Contest${contests.length > 1 ? 's' : ''} Starting Soon!`;
  const html = generateContestEmailHTML(contests, userName);

  return sendEmail({ to: userEmail, subject, html });
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
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; padding: 20px;">
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
               style="background: #3b82f6; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
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