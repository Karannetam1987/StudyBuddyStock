
'use server';
/**
 * @fileOverview This file defines a Genkit flow for answering academic questions.
 *
 * - answerAcademicQuestion - A function that takes an academic question and subject as input and returns an AI-generated answer.
 * - AnswerAcademicQuestionInput - The input type for the answerAcademicQuestion function.
 * - AnswerAcademicQuestionOutput - The return type for the answerAcademicQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerAcademicQuestionInputSchema = z.object({
  question: z.string().describe('The academic question to be answered.'),
  subject: z.string().describe('The subject of the academic question.'),
  language: z.string().optional().describe('The language in which the answer should be provided. Defaults to English.'),
});
export type AnswerAcademicQuestionInput = z.infer<typeof AnswerAcademicQuestionInputSchema>;

const AnswerAcademicQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the academic question.'),
});
export type AnswerAcademicQuestionOutput = z.infer<typeof AnswerAcademicQuestionOutputSchema>;

export async function answerAcademicQuestion(input: AnswerAcademicQuestionInput): Promise<AnswerAcademicQuestionOutput> {
  return answerAcademicQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerAcademicQuestionPrompt',
  input: {schema: AnswerAcademicQuestionInputSchema},
  output: {schema: AnswerAcademicQuestionOutputSchema},
  prompt: `You are an expert in the field of {{{subject}}}.  Answer the following question to the best of your ability, in the language {{{language}}}. If language isn't specified, default to English.\n\nQuestion: {{{question}}}`,
});

const answerAcademicQuestionFlow = ai.defineFlow(
  {
    name: 'answerAcademicQuestionFlow',
    inputSchema: AnswerAcademicQuestionInputSchema,
    outputSchema: AnswerAcademicQuestionOutputSchema,
  },
  async input => {
    const {
      question,
      subject,
      language = 'English', // Default language is English
    } = input;

    const {output} = await prompt({question, subject, language});
    return output!;
  }
);

    