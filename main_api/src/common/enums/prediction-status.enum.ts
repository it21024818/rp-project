export const PredictionStatus = {
  STARTED: "STARTED",
  PREDICTING_FAKE_NEWS: "PREDICTING_FAKE_NEWS",
  EXTRACTING_KEYWORDS: "EXTRACTING_KEYWORDS",
  SEARCHING_RESULTS: "SEARCHING_RESULTS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type PredictionStatus = keyof typeof PredictionStatus;