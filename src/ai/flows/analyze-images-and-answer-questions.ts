'use server';
/**
 * @fileOverview An image analysis AI agent that answers questions about images.
 *
 * - analyzeImageAndAnswer - A function that handles the image analysis and question answering process.
 * - AnalyzeImageAndAnswerInput - The input type for the analyzeImageAndAnswer function.
 * - AnalyzeImageAndAnswerOutput - The return type for the analyzeImageAndAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageAndAnswerInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question to answer about the image.'),
});
export type AnalyzeImageAndAnswerInput = z.infer<typeof AnalyzeImageAndAnswerInputSchema>;

const AnalyzeImageAndAnswerOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the image.'),
});
export type AnalyzeImageAndAnswerOutput = z.infer<typeof AnalyzeImageAndAnswerOutputSchema>;

export async function analyzeImageAndAnswer(input: AnalyzeImageAndAnswerInput): Promise<AnalyzeImageAndAnswerOutput> {
  return analyzeImageAndAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImageAndAnswerPrompt',
  input: {schema: AnalyzeImageAndAnswerInputSchema},
  output: {schema: AnalyzeImageAndAnswerOutputSchema},
  prompt: `You are an expert image analyst.  You will answer the user's question about the image.

Image: {{media url=imageDataUri}}
Question: {{{question}}}

Answer: `,
});

const analyzeImageAndAnswerFlow = ai.defineFlow(
  {
    name: 'analyzeImageAndAnswerFlow',
    inputSchema: AnalyzeImageAndAnswerInputSchema,
    outputSchema: AnalyzeImageAndAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
