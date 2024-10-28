export type ModelResult<T = number> = {
  prediction: T;
  confidence: number;
};

export const Sarcasm = {
  GENERIC: "GENERIC",
  RHETORICAL_QUESTION: "RHETORICAL_QUESTION",
  HYPERBOLE: "HYPERBOLE",
} as const;

export type Sarcasm = keyof typeof Sarcasm;

export const Sentiment = {
  NEGATIVE: "NEGATIVE",
  POSITIVE: "POSITIVE",
  NEUTRAL: "NEUTRAL",
} as const;

export type Sentiment = keyof typeof Sentiment;

export const PoliticalLeaning = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  CENTER: "CENTER",
} as const;

export type PoliticalLeaning = keyof typeof PoliticalLeaning;

export const Text = {
  TWEET: "TWEET",
  NEWS: "NEWS",
} as const;

export type Text = keyof typeof Text;

export const PredictionStatus = {
  STARTED: "STARTED",
  PREDICTING_FAKE_NEWS: "PREDICTING_FAKE_NEWS",
  EXTRACTING_KEYWORDS: "EXTRACTING_KEYWORDS",
  SEARCHING_RESULTS: "SEARCHING_RESULTS",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type PredictionStatus = keyof typeof PredictionStatus;

export type PredictionResult = {
  // Sarcasm detection results
  sarcasmPresentResult: ModelResult<boolean>;
  sarcasmTypeResult: ModelResult<Sarcasm>;
  sarcasmFakeResult: ModelResult<boolean>;

  // Sentiment analysis results
  sentimentFakeResult: ModelResult<boolean>;
  sentimentTypeResult: ModelResult<Sentiment>;
  sentimentTextTypeResult: ModelResult<Text>;

  // Text Quality results
  textQualityResult: ModelResult<boolean>;
  textFakeResult: ModelResult<boolean>;

  // Bias Results
  biasResult: ModelResult<PoliticalLeaning>;
  biasFakeResult: ModelResult<boolean>;

  // Final result
  finalFakeResult: boolean;
};

export type SearchResultDto = {
  title: string;
  description: string;
  link: string;
  thumbnail?: {
    width: number;
    height: number;
    src: string;
  }[];
};

export type PredictionDto = {
  _id: string;
  text: string;
  result?: PredictionResult;
  searchResults?: SearchResultDto[];
  keywords?: string[];
  status: PredictionStatus;
  sourcePredictionId?: string;
  newsSourceId?: string;
  error?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
};

export interface FeedbackDetails {
  message: string;
  textQuality: boolean;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  sarcasm: "GEN" | "RHETORICAL_QUESTION" | "HYPERBOLE";
  bias: "LEFT" | "RIGHT" | "CENTER";
  isFake: boolean;
}

export interface FeedbackDto {
  reaction: "GOOD" | "BAD";
  details: FeedbackDetails;
}

export const SentimentOptions = [
  { label: "Negative", value: "NEGATIVE" },
  { label: "Positive", value: "POSITIVE" },
  { label: "Neutral", value: "NEUTRAL" },
];

export const SarcasmOptions = [
  { label: "Generic", value: "GENERIC" },
  { label: "Rhetorical Question", value: "RHETORICAL_QUESTION" },
  { label: "Hyperbole", value: "HYPERBOLE" },
];

export const BiasOptions = [
  { label: "Left", value: "LEFT" },
  { label: "Center", value: "CENTER" },
  { label: "Right", value: "RIGHT" },
];

export const ReactionEnum = {
  GOOD: "GOOD" as const,
  BAD: "BAD" as const,
};
