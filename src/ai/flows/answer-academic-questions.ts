
'use server';

/**
 * @fileOverview This file contains the server-side logic for answering academic questions.
 *
 * - answerAcademicQuestion: A function to get answers for academic questions.
 */

import { ai } from '@/ai/genkit';
import type { AnswerAcademicQuestionInput, AnswerAcademicQuestionOutput } from '@/ai/schemas/academic-question-schemas';
import { AnswerAcademicQuestionInputSchema, AnswerAcademicQuestionOutputSchema } from '@/ai/schemas/academic-question-schemas';


const answerPrompt = ai.definePrompt({
    name: 'answerAcademicQuestionPrompt',
    input: { schema: AnswerAcademicQuestionInputSchema },
    output: { schema: AnswerAcademicQuestionOutputSchema },
    prompt: `You are an expert in the field of {{{subject}}}. Answer the following question to the best of your ability, in the language {{{language}}}.

Question: {{{question}}}

{{#if image}}
The user has also provided the following image for context. Analyze it to help with your answer.
Image: {{media url=image}}
{{/if}}
`,
});


const answerFlow = ai.defineFlow(
  {
    name: 'answerAcademicQuestionFlow',
    inputSchema: AnswerAcademicQuestionInputSchema,
    outputSchema: AnswerAcademicQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await answerPrompt(input);
    return output!;
  }
);


export async function answerAcademicQuestion(
  input: AnswerAcademicQuestionInput
): Promise<AnswerAcademicQuestionOutput> {
  return await answerFlow(input);
}
