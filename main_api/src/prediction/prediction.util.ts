import { PredictionResponseDto } from 'src/common/dtos/prediction-response.dto';
import { PredictionResult } from 'src/common/dtos/prediction-result.dto';
import { PoliticalLeaning } from 'src/common/enums/political-leaning.enum';
import { Sarcasm } from 'src/common/enums/sarcasm.enum';
import { Sentiment } from 'src/common/enums/sentiment.enum';
import { Text } from 'src/common/enums/text.enum';

const SENTIMENT_BY_LABEL: Record<number, Sentiment> = {
  0: Sentiment.NEGATIVE,
  1: Sentiment.NEUTRAL,
  2: Sentiment.POSITIVE,
};

const TEXT_BY_LABEL: Record<number, Text> = {
  0: Text.NEWS,
  1: Text.TWEET,
};

const SARCASM_BY_LABEL: Record<number, Sarcasm> = {
  0: Sarcasm.GENERIC,
  1: Sarcasm.HYPERBOLE,
  2: Sarcasm.RHETORICAL_QUESTION,
};

const POLITICAL_LEANING_BY_LABEL: Record<number, PoliticalLeaning> = {
  0: PoliticalLeaning.LEFT,
  1: PoliticalLeaning.RIGHT,
};

export class PredictionUtil {
  static buildPredictionResult(response: PredictionResponseDto) {
    return {
      sarcasmPresentResult: {
        confidence: response.sarcasmPresentResult.confidence,
        prediction: !!response.sarcasmPresentResult.prediction,
      },
      sarcasmTypeResult: {
        confidence: response.sarcasmTypeResult.confidence,
        prediction: SARCASM_BY_LABEL[response.sarcasmTypeResult.prediction],
      },
      sarcasmFakeResult: {
        confidence: response.sarcasmFakeResult.confidence,
        prediction: !!response.sarcasmFakeResult.prediction,
      },
      sentimentFakeResult: {
        confidence: response.sentimentFakeResult.confidence,
        prediction: !!response.sentimentFakeResult.prediction,
      },
      sentimentTypeResult: {
        confidence: response.sentimentTypeResult.confidence,
        prediction: SENTIMENT_BY_LABEL[response.sentimentTypeResult.prediction],
      },
      sentimentTextTypeResult: {
        confidence: response.sentimentTypeResult.confidence,
        prediction: TEXT_BY_LABEL[response.sentimentTextTypeResult.prediction],
      },
      textQualityResult: response.textQualityResult,
      grammarQualityResult: response.grammarQualityResult,
      textFakeResult: {
        confidence: response.textFakeResult.confidence,
        prediction: !!response.textFakeResult.prediction,
      },
      biasResult: {
        confidence: response.biasResult.confidence,
        prediction: POLITICAL_LEANING_BY_LABEL[response.biasResult.prediction],
      },
      biasFakeResult: {
        confidence: response.biasFakeResult.confidence,
        prediction: !!response.biasFakeResult.prediction,
      },
      finalFakeResult: !!response.finalFakeResult,
    } satisfies PredictionResult;
  }
}
