import { ModelResult } from "./model-result.dto";

export class PredictionResponseDto {
  // Sarcasm detection results
  sarcasmPresentResult: ModelResult;
  sarcasmTypeResult: ModelResult;
  sarcasmFakeResult: ModelResult;

  // Sentiment analysis results
  sentimentFakeResult: ModelResult;
  sentimentTypeResult: ModelResult;
  sentimentTextTypeResult: ModelResult;

  // Text Quality results
  textQualityResult: ModelResult;
  grammarQualityResult: ModelResult;
  textFakeResult: ModelResult;

  // Bias Results
  biasResult: ModelResult;
  biasFakeResult: ModelResult;

  // Final Result
  finalFakeResult: number;
}