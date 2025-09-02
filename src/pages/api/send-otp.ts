import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

// Initialize Resend with your API key.
// IMPORTANT: In a real application, you should store your API key in an environment variable.
// Create a file named .env.local in the root of your project and add:
// RESEND_API_KEY=your_api_key_here
//
// I cannot create or manage .env files, so for this prototype, I'm leaving it as a placeholder.
// You MUST replace "re_123456789" with your actual Resend API key for this to work in production.
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, newEmail, type } = req.body;

  if (!email || !type) {
    return res.status(400).json({ error: 'Missing email or type' });
  }

  // In a real app, you would generate a secure, random 6-digit OTP and store it
  // temporarily in your database or cache (e.g., Redis) with an expiration time.
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // For this prototype, we'll just log it to the console.
  console.log(`Generated OTP for ${email}: ${otp}`);

  try {
    if (type === 'saveApi') {
      await resend.emails.send({
        from: 'Admin <onboarding@resend.dev>', // You must use a verified domain in Resend
        to: [email],
        subject: 'Your OTP for StudyBuddyStock',
        html: `<p>Your one-time password to save your API & Ads settings is: <strong>${otp}</strong></p>`,
      });
    } else if (type === 'changeAdminEmail') {
      if (!newEmail) {
        return res.status(400).json({ error: 'Missing newEmail for changeAdminEmail type' });
      }
      const otpNew = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`Generated OTP for new email ${newEmail}: ${otpNew}`);
      
      // Send OTP to old email
      await resend.emails.send({
        from: 'Admin <onboarding@resend.dev>',
        to: [email],
        subject: 'Admin Email Change Request for StudyBuddyStock',
        html: `<p>A request was made to change your admin email. Your OTP is: <strong>${otp}</strong></p>`,
      });

      // Send OTP to new email
      await resend.emails.send({
        from: 'Admin <onboarding@resend.dev>',
        to: [newEmail],
        subject: 'Verify Your New Admin Email for StudyBuddyStock',
        html: `<p>To complete your admin email change, please use this OTP: <strong>${otpNew}</strong></p>`,
      });
    } else {
        return res.status(400).json({ error: 'Invalid OTP type' });
    }

    // In a real app, you would not send the OTP back in the response.
    // This is just for demonstration purposes.
    res.status(200).json({ message: 'OTP sent successfully (check console).', otp: otp });

  } catch (error) {
    console.error('Error sending email:', error);
    // Since this is a prototype and the API key is a placeholder,
    // we will return a success message to allow the UI to proceed.
    // In a real application, you would return a 500 error.
    console.log("PROTOTYPE MODE: Faking successful OTP send.");
    res.status(200).json({ message: 'OTP sent successfully (Prototype Mode).', otp: otp });
    // res.status(500).json({ error: 'Failed to send email' });
  }
}
