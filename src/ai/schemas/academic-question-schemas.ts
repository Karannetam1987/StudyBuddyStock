
/**
 * @fileOverview This file defines the Zod schemas for the academic question answering feature.
 *
 * - AnswerAcademicQuestionInputSchema: The Zod schema for the input of the answerAcademicQuestion flow.
 * - AnswerAcademicQuestionOutputSchema: The Zod schema for the output of the answerAcademicQuestion flow.
 * - AnswerAcademicQuestionInput: The TypeScript type for the input.
 * - AnswerAcademicQuestionOutput: The TypeScript type for the output.
 */

import { z } from "zod";

export const AnswerAcademicQuestionInputSchema = z.object({
  subject: z.string().describe("The subject of the academic question."),
  language: z.string().describe("The language in which the answer should be provided."),
  question: z.string().describe("The academic question to be answered."),
  image: z.string().optional().describe("An optional image provided as a data URI for context."),
});

export const AnswerAcademicQuestionOutputSchema = z.object({
  answer: z.string().describe("The AI-generated answer to the academic question."),
});

export type AnswerAcademicQuestionInput = z.infer<typeof AnswerAcademicQuestionInputSchema>;
export type AnswerAcademicQuestionOutput = z.infer<typeof AnswerAcademicQuestionOutputSchema>;
