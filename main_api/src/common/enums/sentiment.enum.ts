export const Sentiment = {
  NEGATIVE: 'NEGATIVE',
  POSITIVE: 'POSITIVE',
  NEUTRAL: 'NEUTRAL',
} as const;

export type Sentiment = keyof typeof Sentiment;
