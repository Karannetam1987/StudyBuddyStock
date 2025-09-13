
import { answerAcademicQuestion } from '@/ai/flows/answer-academic-questions';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Input validation can be done here with Zod if needed
    const { subject, language, question, image } = body;

    if (!subject || !language || !question) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await answerAcademicQuestion({
      subject,
      language,
      question,
      image,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
