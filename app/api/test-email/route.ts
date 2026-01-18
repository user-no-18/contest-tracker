import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/app/lib/email/emailService';

export async function GET() {
  const result = await sendWelcomeEmail(
    'debjyoti2409@example.com',
    'Debjyoti Roy'
  );
  
  return NextResponse.json(result);
}