from transformers import DistilBertModel, AutoTokenizer, AutoModelForSequenceClassification
import torch.nn as nn
import pickle as pkl
import torch
import numpy as np
from captum.attr import LayerIntegratedGradients

class CustomBertModel(nn.Module):
    def __init__(self):
        super(CustomBertModel, self).__init__()
        self.bert = DistilBertModel.from_pretrained('distilbert-base-uncased').to('cpu')

        # Freezing the parameters and defining trainable BERT structure
        for param in self.bert.parameters():
          param.requires_grad = False

        self.hidden_size = self.bert.config.hidden_size
        self.sentiments = nn.Linear(1, self.hidden_size)
        self.combine = nn.Linear(self.hidden_size * 2, self.hidden_size)
        self.fc2 = nn.Linear(self.hidden_size, self.hidden_size)
        self.classifier = nn.Linear(self.hidden_size, 1)
        self.activation = nn.LeakyReLU(negative_slope=0.01) # To avoid nan values
        self.dropout = nn.Dropout(p=0.1)
        self.layer_norm = nn.LayerNorm(self.hidden_size)

    def forward(self, input_ids, attention_mask, sentiment_scores):
        sentiment_scores = torch.nan_to_num(sentiment_scores, nan=0.0)
        
        # Get BERT embeddings
        bert_output = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        sequence_output = bert_output.last_hidden_state

        # Project sentiment scores
        sentiment_scores = sentiment_scores.unsqueeze(-1).float()
        sentiment_embeds = self.sentiments(sentiment_scores)

        # Combine embeddings
        combined_embeds = torch.cat((sequence_output, sentiment_embeds), dim=-1)
        combined_embeds = self.combine(combined_embeds)
        combined_embeds = self.activation(combined_embeds)

        # Additional layer
        combined_embeds = self.fc2(combined_embeds)
        combined_embeds = self.activation(combined_embeds)

        # Apply classifier on the [CLS] token representation
        logits = self.classifier(combined_embeds[:, 0, :])
        return logits

# Load all sub models
def load_sentiment_model():
    news_model_path = 'models/sentiment_fake_news_news_distilbert_model_weights.pt'
    tweet_model_path = 'models/sentiment_fake_news_tweet_distilbert_model_weights.pt'
    classifier_model_path = 'models/classifier.pkl'
    news_model = CustomBertModel();
    tweet_model = CustomBertModel();
    news_model.load_state_dict(torch.load(news_model_path, map_location=torch.device('cpu')))
    tweet_model.load_state_dict(torch.load(tweet_model_path, map_location=torch.device('cpu')))
    classifier_model = pkl.load(open(classifier_model_path, 'rb'))
    sent_model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
    return news_model, tweet_model, sent_model, classifier_model

def get_sentiment_scores(sent_model, sent_tokenizer, text):
    sent_tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
    sent_model.eval()
    layer = sent_model.distilbert.embeddings
    def forward_fn(inputs):
        output = torch.sigmoid(sent_model(inputs)[0])[0]  # binary
        return output

    print("Tokenizing text for sentiment scores")
    text_ids = sent_tokenizer.encode(text, add_special_tokens=False)
    text_ids = text_ids[:510] # Drop the rest as distilbert cannot handle it
    input_ids = [sent_tokenizer.cls_token_id] + text_ids + [sent_tokenizer.sep_token_id]
    ref_input_ids = [sent_tokenizer.cls_token_id] + [sent_tokenizer.pad_token_id] * len(text_ids) + [sent_tokenizer.sep_token_id]

    input_ids = torch.tensor([input_ids], device=device)
    ref_input_ids = torch.tensor([ref_input_ids], device=device)

    print("Getting attributions", input_ids.shape, ref_input_ids.shape)
    lig = LayerIntegratedGradients(forward_fn, layer)
    attributions = lig.attribute(inputs=input_ids, baselines=ref_input_ids, n_steps=15, internal_batch_size=16)

    print("Summing attributions")
    attributions = attributions.sum(dim=-1).squeeze()
    attributions_sum = attributions / torch.norm(attributions)
    attributions_sum = attributions_sum.tolist()

    if (len(attributions_sum) > 512):
            attributions_sum = attributions_sum[:512]
    else:
            attributions_sum += [0] * (512 - len(attributions_sum))

    print("Predicting sentiment")
    output = forward_fn(input_ids)
    prediction = output.argmax().item()
    prediction_confidence = output[prediction].item()
    return attributions_sum, prediction, prediction_confidence

def detect_sentiment(text, news_model, tweet_model, sent_model, classifier_model):
    tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
    with torch.no_grad():
        print("Predicting sentiment")
        sentiment_scores, sentiment_prediction, sentiment_prediction_confidence = get_sentiment_scores(sent_model, sent_tokenizer, text)
        
        print("Predicting input type")
        probabilities_per_input_type = classifier_model.predict_proba([text])	
        input_type_confidence = np.max(probabilities_per_input_type)
        input_type_prediction = np.argmax(probabilities_per_input_type)

        print("Tokenizing text")
        encoding = tokenizer(text, return_tensors='pt', max_length=512, padding='max_length', truncation=True)
        input_ids = np.array(encoding['input_ids'].squeeze().tolist())
        attention_mask = np.array(encoding['attention_mask'].squeeze().tolist())

        print("Converting to tensors")
        input_ids = torch.tensor([input_ids], device=device)
        attention_mask = torch.tensor([attention_mask], device=device)
        sentiment_scores = torch.tensor([sentiment_scores], device=device)
    
        if input_type_prediction == 1:
                print("Predicting tweet fake news type")
                output = tweet_model(input_ids, attention_mask, sentiment_scores)
                fake_news_confidence = torch.sigmoid(output).item()
                fake_news_prediction = torch.sigmoid(output) > 0.5
                fake_news_prediction = float(fake_news_prediction.item())
        else:
                print("Predicting news fake news type")
                output = news_model(input_ids, attention_mask, sentiment_scores)
                fake_news_confidence = torch.sigmoid(output).item()
                fake_news_prediction = torch.sigmoid(output) > 0.5
                fake_news_prediction = float(fake_news_prediction.item())
        return int(fake_news_prediction), round(fake_news_confidence, 2), int(input_type_prediction), round(input_type_confidence, 2), int(sentiment_prediction), round(sentiment_prediction_confidence, 2)