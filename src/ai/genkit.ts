import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {genkitEval, GenkitMetric} from '@genkit-ai/eval';
import {dotprompt} from '@genkit-ai/dotprompt';
import {googleCloud} from '@genkit-ai/google-cloud';

export const ai = genkit({
  plugins: [
    googleAI(),
    dotprompt(),
    googleCloud(),
    genkitEval({
      judge: 'googleai/gemini-pro',
      metrics: [
        GenkitMetric.FAITHFULNESS,
        GenkitMetric.ANSWER_RELEVANCY,
        GenkitMetric.MALICIOUSNESS,
      ],
      embedder: 'googleai/text-embedding-004',
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
  enableTracing: true,
  traceStore: 'googleCloud',
});
