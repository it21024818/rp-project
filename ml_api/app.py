from flask import Flask, request, jsonify
from flask_cors import CORS
# from experts.sarcasm_expert import load_sarcasm_model, detect_sarcasm
# from experts.quality_expert import load_quality_model, detect_quality
from experts.bias_expert import load_bias_model, predict_bias_and_fake_news
# from experts.sentiment_expert import load_sentiment_model, analyze_sentiment
# from google.colab import drive
# import gdown
# from tensorflow.keras.models import load_model
# from keybert import KeyBERT
# import numpy as np
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter
nltk.download('punkt')
nltk.download('stopwords')

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize the KeyBERT model
# kw_model = KeyBERT()

# Load all models
# sarcasm_model = load_sarcasm_model()
# quality_model = load_quality_model()
bias_model = load_bias_model()
# sentiment_model = load_sentiment_model()

# Function to calculate the weighted prediction
def weighted_prediction(expert_predictions):
    total_confidence = sum([confidence for _, confidence in expert_predictions])

    if total_confidence == 0:
        return 0  # Avoid division by zero

    weighted_sum = sum([prediction * confidence for prediction, confidence in expert_predictions])
    weighted_score = weighted_sum / total_confidence

    # Return final prediction
    return weighted_score

def combine_expert_outputs(text):
    # sarcasm_prediction, sarcasm_news_pred, sarcasm_news_confidence = detect_sarcasm(text)
    # bias_labels, predicted_fake_news, confidence_fake_news, fake_news_boolean = predict_bias_and_fake_news(text, bias_model)
    # sentiment_prediction, sentiment_news_pred, sentiment_news_confidence = detect_sentiment(text)
    # quality_prediction, quality_news_pred, quality_news_confidence = detect_quality(text)
    bias_pred, bias_confidence, bias_news_pred, bias_news_confidence = predict_bias_and_fake_news(text, bias_model)

    sarcasm_pred, sarcasm_confidence, sarcasm_type_pred, sarcasm_type_confidence, sarcasm_news_pred, sarcasm_news_confidence = 1, 0.76, 1, 0.76, 1, 0.76
    sentiment_news_pred, sentiment_news_confidence, sentiment_type_pred, sentiment_type_confidence, sentiment_pred, sentiment_confidence = 0, 0.6, 0, 0.6, 0, 0.6
    quality_pred, quality_confidence, quality_news_pred, quality_news_confidence = 1, 0.78, 1, 0.78
    # bias_pred, bias_confidence, bias_news_pred, bias_news_confidence = 1, 0.8, 1, 0.8

    expert_predictions = [
        (sarcasm_news_pred, sarcasm_news_confidence),
        (bias_news_pred, bias_news_confidence),
        (sentiment_news_pred, sentiment_news_confidence),
        (quality_news_pred, quality_news_confidence)
    ]

    # Calculate the final prediction
    final_score = weighted_prediction(expert_predictions)

    return final_score, sarcasm_pred, sarcasm_confidence, sarcasm_type_pred, sarcasm_type_confidence, sarcasm_news_pred, sarcasm_news_confidence, sentiment_news_pred, sentiment_news_confidence, sentiment_type_pred, sentiment_type_confidence, sentiment_pred, sentiment_confidence, quality_pred, quality_confidence, quality_news_pred, quality_news_confidence, bias_pred, bias_confidence, bias_news_pred, bias_news_confidence

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    text = data.get('text', '')
    final_score, sarcasm_pred, sarcasm_confidence, sarcasm_type_pred, sarcasm_type_confidence, sarcasm_news_pred, sarcasm_news_confidence, sentiment_news_pred, sentiment_news_confidence, sentiment_type_pred, sentiment_type_confidence, sentiment_pred, sentiment_confidence, quality_pred, quality_confidence, quality_news_pred, quality_news_confidence, bias_pred, bias_confidence, bias_news_pred, bias_news_confidence = combine_expert_outputs(text)

    # Map the results to the PredictionResponseDto structure
    response = {
        "sarcasmPresentResult": {"prediction": sarcasm_pred, "confidence": sarcasm_confidence},  
        "sarcasmTypeResult": {"prediction": sarcasm_type_pred, "confidence": sarcasm_type_confidence},  
        "sarcasmFakeResult": {"prediction": sarcasm_news_pred, "confidence": sarcasm_news_confidence}, 
        "sentimentFakeResult": {"prediction": sentiment_news_pred, "confidence": sentiment_news_confidence},  
        "sentimentTypeResult": {"prediction": sentiment_type_pred, "confidence": sentiment_type_confidence},  
        "sentimentTextTypeResult": {"prediction": sentiment_pred, "confidence": sentiment_confidence},  
        "textQualityResult": {"prediction": quality_pred, "confidence": quality_confidence},  
        "textFakeResult": {"prediction": quality_news_pred, "confidence": quality_news_confidence},  
        "biasResult": {"prediction": bias_pred, "confidence": bias_confidence},  
        "biasFakeResult": {"prediction": bias_news_pred, "confidence": bias_news_confidence},
        "finalFakeResult": final_score
    }

    return response

@app.route('/extract-keywords', methods=['POST'])
def extract_keywords():
    data = request.get_json(force=True)
    text = data.get('text', '')
    
    # Tokenize the text into individual words
    words = word_tokenize(text)

    # Remove stopwords (common words like "the", "and", etc.)
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word.lower() not in stop_words]

    # Count the frequency of each word
    freq_dist = Counter(words)

    # Get the top 8 most frequent words
    top_words = freq_dist.most_common(10)
      
    # Return the extracted keywords as a list of strings
    return jsonify({'keywords': [word for word, freq in top_words]})

# @app.route('/extract-keywords', methods=['POST'])
# def extract_keywords():
#     data = request.get_json(force=True)
#     text = data.get('text', '')
    
#     try:
#         import numpy as np
#         # Extract keywords using KeyBERT
#         keywords = kw_model.extract_keywords(text)
        
#         # Return the extracted keywords as a list of strings
#         return jsonify({'keywords': [x for x, y in keywords]})
#     except Exception as e:
#         # Handle the exception here
#         return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
