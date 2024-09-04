import { ModelResult } from './model-result.dto';

export class PredictionResponseDto {
  // Sarcasm detection results
  sarcasmPresentResult: ModelResult<number>;
  sarcasmTypeResult: ModelResult<number>;
  sarcasmFakeResult: ModelResult<number>;

  // Sentiment analysis results
  sentimentFakeResult: ModelResult<number>;
  sentimentTypeResult: ModelResult<number>;
  sentimentTextTypeResult: ModelResult;

  // Text Quality results
  textQualityResult: ModelResult<number>;
  textFakeResult: ModelResult<number>;

  // Bias Results
  biasResult: ModelResult<number>;
  biasFakeResult: ModelResult<number>;

  // Final Result
  finalFakeResult: number;
}
