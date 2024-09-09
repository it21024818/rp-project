# @title Sarcasm Expert
import torch
import numpy as np
from transformers import BertTokenizerFast, AutoModel
import torch.nn as nn

class BERT_Arch(nn.Module):
    def __init__(self, bert):
        super(BERT_Arch, self).__init__()
        self.bert = bert
        self.dropout = nn.Dropout(0.1)  # dropout layer
        self.relu = nn.ReLU()  # relu activation function

        # Dense layers for sarcastic classification
        self.fc1_sarcastic = nn.Linear(768, 512)
        self.fc2_sarcastic = nn.Linear(512, 2)

        # Dense layers for type classification
        self.fc1_type = nn.Linear(768, 512)
        self.fc2_type = nn.Linear(512, 4)

        # Dense layers for fake/not fake classification
        self.fc1_fake = nn.Linear(768 + 2 + 4, 512)  # Include sarcasm and type outputs
        self.fc2_fake = nn.Linear(512, 2)

        self.softmax = nn.LogSoftmax(dim=1)  # softmax activation function


    def forward(self, sent_id, mask):
        cls_hs = self.bert(sent_id, attention_mask=mask)['pooler_output']

        # Sarcastic classification
        x_sarcastic = self.fc1_sarcastic(cls_hs)
        x_sarcastic = self.relu(x_sarcastic)
        x_sarcastic = self.dropout(x_sarcastic)
        x_sarcastic = self.fc2_sarcastic(x_sarcastic)
        x_sarcastic = self.softmax(x_sarcastic)

        # Type classification
        x_type = self.fc1_type(cls_hs)
        x_type = self.relu(x_type)
        x_type = self.dropout(x_type)
        x_type = self.fc2_type(x_type)
        x_type = self.softmax(x_type)

        # Fake/Not fake classification
        combined_features = torch.cat((cls_hs, x_sarcastic, x_type), dim=1)
        x_fake = self.fc1_fake(combined_features)
        x_fake = self.relu(x_fake)
        x_fake = self.dropout(x_fake)
        x_fake = self.fc2_fake(x_fake)
        x_fake = self.softmax(x_fake)

        return x_fake, x_sarcastic, x_type

# Load the sarcasm model
def load_sarcasm_model():
    # Load BERT model and tokenizer via HuggingFace Transformers
    bert = AutoModel.from_pretrained('bert-base-uncased')
    sarcasm_model_path = 'models/sarc_model.pt'
    model = BERT_Arch(bert)
    model.load_state_dict(torch.load(sarcasm_model_path, map_location='cpu'))
    return model

def detect_sarcasm(unseen_news_text, sarcasm_model):
    tokenizer = BertTokenizerFast.from_pretrained('bert-base-uncased')
    
    # Tokenize and encode the input text
    tokens_unseen = tokenizer.batch_encode_plus(
        [unseen_news_text],
        max_length=128,
        padding=True,
        truncation=True,
        return_tensors='pt'
    )

    unseen_seq = tokens_unseen['input_ids']
    unseen_mask = tokens_unseen['attention_mask']

    sarcasm_model.eval()
    with torch.no_grad():
        preds_fake, preds_sarcastic, preds_type = sarcasm_model(unseen_seq, unseen_mask)
        preds_fake = preds_fake.detach().cpu().numpy()
        preds_sarcastic = preds_sarcastic.detach().cpu().numpy()
        preds_type = preds_type.detach().cpu().numpy()

    # Convert LogSoftmax outputs to probabilities
    preds_fake_prob = np.exp(preds_fake)
    preds_sarcastic_prob = np.exp(preds_sarcastic)
    preds_type_prob = np.exp(preds_type)

    # Calculate confidence scores before taking argmax
    fake_confidence = np.max(preds_fake_prob, axis=1)
    sarcastic_confidence = np.max(preds_sarcastic_prob, axis=1)
    type_confidence = np.max(preds_type_prob, axis=1)

    # Get the predicted classes
    preds_fake = np.argmax(preds_fake_prob, axis=1)
    preds_sarcastic = np.argmax(preds_sarcastic_prob, axis=1)
    preds_type = np.argmax(preds_type_prob, axis=1)

    # Convert to int and float
    preds_sarcastic = int(preds_sarcastic[0])
    sarcastic_confidence = float(sarcastic_confidence[0])
    preds_type = int(preds_type[0])
    type_confidence = float(type_confidence[0])
    preds_fake = int(preds_fake[0])
    fake_confidence = float(fake_confidence[0])
    
    # Return predictions and confidence scores
    return preds_sarcastic, sarcastic_confidence, preds_type, type_confidence, preds_fake, fake_confidence