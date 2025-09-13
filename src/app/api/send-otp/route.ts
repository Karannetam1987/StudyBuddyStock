
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, otp } = body;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("Resend API key is not configured on the server.");
      // In a real production app, you wouldn't expose this error message.
      return NextResponse.json({ error: 'Email service is not configured.' }, { status: 500 });
    }

    if (!to || !subject || !otp) {
      return NextResponse.json({ error: 'Missing required fields: to, subject, or otp' }, { status: 400 });
    }

    const resend = new Resend(resendApiKey);

    const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: `StudyBuddyStock <${fromAddress}>`,
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
          <h2>${subject}</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; border: 1px solid #ddd; padding: 10px; display: inline-block; background-color: #f9f9f9;">
            ${otp}
          </p>
          <p>This code will expire in 10 minutes.</p>
          <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json({ error: 'Failed to send email.', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully', data });

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
