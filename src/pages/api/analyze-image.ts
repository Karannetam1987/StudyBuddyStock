import { NextApiRequest, NextApiResponse } from 'next';
import { analyzeImageAndAnswer, AnalyzeImageAndAnswerInput } from '@/ai/flows/analyze-images-and-answer-questions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageDataUri, question } = req.body as AnalyzeImageAndAnswerInput;

    if (!imageDataUri || !question) {
      return res.status(400).json({ error: 'Missing imageDataUri or question' });
    }

    const result = await analyzeImageAndAnswer({ imageDataUri, question });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
}
