import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {dotprompt} from '@genkit-ai/dotprompt';
import {googleCloud} from '@genkit-ai/google-cloud';

export const ai = genkit({
  plugins: [
    googleAI(),
    dotprompt(),
    googleCloud(),
  ],
  model: 'googleai/gemini-2.5-flash',
  enableTracing: true,
  traceStore: 'googleCloud',
});
