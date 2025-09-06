import { NextApiRequest, NextApiResponse } from 'next';
import { answerAcademicQuestion, AnswerAcademicQuestionInput } from '@/ai/flows/answer-academic-questions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { question, subject, language } = req.body as AnswerAcademicQuestionInput;

    if (!question || !subject) {
      return res.status(400).json({ error: 'Missing question or subject' });
    }

    const result = await answerAcademicQuestion({ question, subject, language });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: 'Failed to answer question' });
  }
}
