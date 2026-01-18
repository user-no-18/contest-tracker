import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/app/lib/email/emailService';

export async function GET() {
  const result = await sendWelcomeEmail(
    'test@example.com',
    'Test User'
  );
  
  return NextResponse.json(result);
}