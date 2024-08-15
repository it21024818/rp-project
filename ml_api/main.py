from flask import Flask, request, jsonify
from flask_cors import CORS
# from experts.sarcasm_expert import load_sarcasm_model, detect_sarcasm
# from experts.quality_expert import load_quality_model, detect_quality
from experts.bias_expert import load_bias_model, predict_bias_and_fake_news
# from experts.sentiment_expert import load_sentiment_model, analyze_sentiment
# from google.colab import drive
# import gdown
# from tensorflow.keras.models import load_model

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Mount Google Drive
# drive.mount('/content/drive')

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
    bias_labels, predicted_fake_news, confidence_fake_news, fake_news_boolean = predict_bias_and_fake_news(text, bias_model)
    # sentiment_prediction, sentiment_news_pred, sentiment_news_confidence = detect_sentiment(text)
    # quality_prediction, quality_news_pred, quality_news_confidence = detect_quality(text)

    sarcasm_news_pred, sarcasm_news_confidence = 1, 0.76
    sentiment_news_pred, sentiment_news_confidence = 0, 0.6
    quality_news_pred, quality_news_confidence = 1, 0.78
    sarcasm_prediction = "not sarcastic"
    sentiment_prediction = "no sentiment"
    quality_prediction = "good quality"

    expert_predictions = [
        (sarcasm_news_pred, sarcasm_news_confidence),
        (fake_news_boolean, confidence_fake_news),
        (sentiment_news_pred, sentiment_news_confidence),
        (quality_news_pred, quality_news_confidence)
    ]

    # Calculate the final prediction
    final_score = weighted_prediction(expert_predictions)

    return final_score, bias_labels, sarcasm_prediction, sentiment_prediction, quality_prediction

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    text = data.get('text', '')
    final_score, bias_labels, sarcasm_prediction, sentiment_prediction, quality_prediction = combine_expert_outputs(text)

    # Further processing and return predictions as needed
    response = {
        "final_score": final_score,
        "sarcasm_detection": sarcasm_prediction,
        "quality_assessment": quality_prediction,
        "predicted_bias": bias_labels,
        "sentiment_prediction": sentiment_prediction,
    }
    
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
