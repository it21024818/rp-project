import { PoliticalLeaning } from "../enums/political-leaning.enum";
import { Sarcasm } from "../enums/sarcasm.enum";
import { Sentiment } from "../enums/sentiment.enum";
import { ModelResult } from "./model-result.dto";

export class PredictionResult {
  // Sarcasm detection results
  sarcasmPresentResult: ModelResult<boolean>;
  sarcasmTypeResult: ModelResult<Sarcasm>;
  sarcasmFakeResult: ModelResult<boolean>;

  // Sentiment analysis results
  sentimentFakeResult: ModelResult<boolean>;
  sentimentTypeResult: ModelResult<Sentiment>;
  sentimentTextTypeResult: ModelResult<boolean>;

  // Text Quality results
  textQualityResult: ModelResult<number>;
  grammarQualityResult: ModelResult<number>;
  textFakeResult: ModelResult<boolean>;

  // Bias Results
  biasResult: ModelResult<PoliticalLeaning>;
  biasFakeResult: ModelResult<boolean>;

  // Final result
  finalFakeResult: boolean;
} 
