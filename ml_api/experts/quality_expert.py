import torch
import numpy as np
from transformers import RobertaTokenizerFast, RobertaModel
import torch.nn as nn

class RoBERTa_Arch(nn.Module):
    def __init__(self, roberta):
        super(RoBERTa_Arch, self).__init__()
        self.roberta = roberta
        self.dropout = nn.Dropout(0.1)
        self.relu = nn.ReLU()

        # Dense layers for quality classification
        self.fc1_quality = nn.Linear(768, 512)
        self.fc2_quality = nn.Linear(512, 2)

        # Dense layers for fake/not fake classification
        self.fc1_fake = nn.Linear(768 + 2, 512)
        self.fc2_fake = nn.Linear(512, 2)

        self.softmax = nn.LogSoftmax(dim=1)

    def forward(self, sent_id, mask):
        cls_hs = self.roberta(sent_id, attention_mask=mask)['last_hidden_state'][:, 0, :]

        # Quality classification
        x_quality = self.fc1_quality(cls_hs)
        x_quality = self.relu(x_quality)
        x_quality = self.dropout(x_quality)
        x_quality = self.fc2_quality(x_quality)
        x_quality = self.softmax(x_quality)

        # Fake/Not fake classification
        combined_features = torch.cat((cls_hs, x_quality), dim=1)
        x_fake = self.fc1_fake(combined_features)
        x_fake = self.relu(x_fake)
        x_fake = self.dropout(x_fake)
        x_fake = self.fc2_fake(x_fake)
        x_fake = self.softmax(x_fake)

        return x_fake, x_quality

# Load the best model with map_location set to CPU
def load_quality_model():
    # Load RoBERTa model and tokenizer via HuggingFace Transformers
    roberta = RobertaModel.from_pretrained('roberta-base')
    model = RoBERTa_Arch(roberta)
    model_path = 'models/quality_model.pt'
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()  # Set the model to evaluation mode
    return model

def detect_quality(text, quality_model):
    tokenizer = RobertaTokenizerFast.from_pretrained('roberta-base')
    # Tokenize and encode sequences in the unseen set
    tokens_unseen = tokenizer.batch_encode_plus(
        [text],
        max_length=128,
        pad_to_max_length=True,
        truncation=True
    )

    unseen_seq = torch.tensor(tokens_unseen['input_ids'])
    unseen_mask = torch.tensor(tokens_unseen['attention_mask'])

    with torch.no_grad():
        preds_fake, preds_quality = quality_model(unseen_seq, unseen_mask)

        # Convert logits to probabilities using softmax
        fake_probs = torch.nn.functional.softmax(preds_fake.clone().detach(), dim=1).cpu().numpy()
        quality_probs = torch.nn.functional.softmax(preds_quality.clone().detach(), dim=1).cpu().numpy()

    # Get predicted labels and confidence scores
    preds_quality_labels = np.argmax(quality_probs, axis=1)
    preds_fake_labels = np.argmax(fake_probs, axis=1)
    quality_confidences = np.max(quality_probs, axis=1)
    fake_confidence = np.max(fake_probs, axis=1)
    
    # Convert to expected output values and cast to native Python types
    quality_pred = int(preds_quality_labels[0])  # 1 for Good Quality, 0 for Bad Quality
    quality_confidence = float(quality_confidences[0])  # Confidence for Quality Prediction
    quality_news_pred = int(preds_fake_labels[0])  # 1 for Not Fake, 0 for Fake
    quality_news_confidence = float(fake_confidence[0])  # Confidence for Fake/Not Fake

    return quality_pred, quality_confidence, quality_news_pred, quality_news_confidence