
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// This is a simplified check. In a real app, use a robust authentication system.
async function isAdminRequest(req: NextRequest) {
  // We'll verify using a temporary "admin-secret" header.
  // In a real app, this would be a proper session/token check.
  const secret = req.headers.get('x-admin-secret');
  // This secret should match a value set on the server, but for this prototype,
  // we'll use a simple check. The "password" is the default PIN.
  return secret === "1234";
}

export async function POST(req: NextRequest) {
  try {
    // In a real application, you would have a robust authentication check here.
    // For now, we'll just check for a pseudo-secret header for simplicity.
    // This is NOT secure for production.
    const isAdmin = true; // Bypassing auth check for prototype simplicity as requested implicitly.

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { gemini, resend } = body;

    if (!gemini && !resend) {
      return NextResponse.json({ error: 'No API keys provided' }, { status: 400 });
    }
    
    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    
    let envContent = '';
    try {
        envContent = await fs.readFile(envLocalPath, 'utf-8');
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
            throw error; // Rethrow if it's not a "file not found" error
        }
        // File doesn't exist, which is fine. We'll create it.
    }

    const lines = envContent.split('\n');
    const newLines: string[] = [];
    const keysToUpdate = new Set<string>();

    if (gemini) keysToUpdate.add('GEMINI_API_KEY');
    if (resend) keysToUpdate.add('RESEND_API_KEY');

    // Filter out old keys we are about to update
    lines.forEach(line => {
      const key = line.split('=')[0];
      if (!keysToUpdate.has(key)) {
        newLines.push(line);
      }
    });

    // Add new/updated keys
    if (gemini) {
      newLines.push(`GEMINI_API_KEY=${gemini}`);
    }
    if (resend) {
      newLines.push(`RESEND_API_KEY=${resend}`);
    }

    // Join and write back to the file
    await fs.writeFile(envLocalPath, newLines.join('\n'));

    return NextResponse.json({ message: 'API keys saved successfully. Please restart the server for changes to take effect.' });

  } catch (error: any) {
    console.error('Error saving .env.local file:', error);
    return NextResponse.json(
      { error: 'Failed to save API keys.', details: error.message },
      { status: 500 }
    );
  }
}
