export interface Predictions {
  text: string;
  url: string;
}

// Interface for search results thumbnail
export interface Thumbnail {
  src: string;
  width: string;
  height: string;
}

// Interface for individual search result
export interface SearchResult {
  title: string;
  description: string;
  link: string;
  thumbnail?: Thumbnail[]; // Optional because some search results may not have a thumbnail
}

// Interface for the result fields (sarcasm, sentiment, bias, etc.)
export interface SarcasmPresentResult {
  confidence: number;
  prediction: boolean;
}

export interface SarcasmTypeResult {
  confidence: number;
  prediction: string; // e.g., "HYPERBOLE"
}

export interface SentimentResult {
  confidence: number;
  prediction: boolean;
}

export interface SentimentTypeResult {
  confidence: number;
  prediction: string; // e.g., "NEGATIVE"
}

export interface SentimentTextTypeResult {
  confidence: number;
  prediction: string; // e.g., "NEWS"
}

export interface TextQualityResult {
  confidence: number;
  prediction: boolean;
}

export interface TextFakeResult {
  confidence: number;
  prediction: boolean;
}

export interface BiasResult {
  confidence: number;
  prediction: string; // e.g., "RIGHT"
}

export interface BiasFakeResult {
  confidence: number;
  prediction: boolean;
}

// Interface for the overall result object
export interface Result {
  sarcasmPresentResult: SarcasmPresentResult;
  sarcasmTypeResult: SarcasmTypeResult;
  sarcasmFakeResult: SarcasmPresentResult; // Similar structure to sarcasmPresentResult
  sentimentFakeResult: SentimentResult;
  sentimentTypeResult: SentimentTypeResult;
  sentimentTextTypeResult: SentimentTextTypeResult;
  textQualityResult: TextQualityResult;
  textFakeResult: TextFakeResult;
  biasResult: BiasResult;
  biasFakeResult: BiasFakeResult;
  finalFakeResult: boolean;
}

// Main interface for the data structure
export interface DataType {
  createdBy: string;
  createdAt: string;
  text: string;
  searchResults: SearchResult[];
  keywords: string[];
  status: string;
  newsSourceId: string;
  _id: string;
  __v: number;
  sourcePredictionId: string;
  result: Result;
  updatedAt: string;
  updatedBy: string;
}
