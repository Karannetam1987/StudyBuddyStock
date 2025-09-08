import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: "AIzaSyDsgYr-JxE2a9WLCSZRHuZWHfoFai7ek_I"
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
  enableTracing: true,
});
