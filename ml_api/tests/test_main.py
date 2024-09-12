import unittest
from app import app, predict, weighted_prediction
from flask import json
import nltk

nltk.download('punkt_tab')

class TestMLAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_predict_endpoint(self):
        # Test that the predict endpoint returns a 200 status code
        response = self.app.post('/predict', data=json.dumps({'text': "The USSC Briefing Room gives you a seat at the table for a briefing on the latest US news and foreign policy. Co-hosts Mari Koeck and Jared Mondschein talk to experts to cover what you need to know and what's beneath the surface of the news."}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_predict_response(self):
        # Test that the predict endpoint returns a 200 status code with the expected response format
        response = self.app.post('/predict', data=json.dumps({'text': "The USSC Briefing Room gives you a seat at the table for a briefing on the latest US news and foreign policy. Co-hosts Mari Koeck and Jared Mondschein talk to experts to cover what you need to know and what's beneath the surface of the news."}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('biasFakeResult', data)
        self.assertIn('biasResult', data)
        self.assertIn('finalFakeResult', data)
        self.assertIn('sarcasmFakeResult', data)
        self.assertIn('sarcasmPresentResult', data)
        self.assertIn('sarcasmTypeResult', data)
        self.assertIn('sentimentFakeResult', data)
        self.assertIn('sentimentTextTypeResult', data)
        self.assertIn('sentimentTypeResult', data)
        self.assertIn('textFakeResult', data)
        self.assertIn('textQualityResult', data)

    # def test_predict_empty_text(self):
    #     # Test that the predict endpoint returns a 200 status code with an error message
    #     response = self.app.post('/predict', data=json.dumps({'text': ''}), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     data = json.loads(response.data)
    #     self.assertIn('error', data)

    # def test_predict_invalid_input(self):
    #     # Test that the predict endpoint returns a 200 status code with an error message
    #     response = self.app.post('/predict', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     data = json.loads(response.data)
    #     self.assertIn('error', data)

    def test_extract_keywords_success(self):
        # Test that the endpoint returns a 200 status code with the expected response format
        data = {'text': 'This is a sample text for extracting keywords.'}
        response = self.app.post('/extract-keywords', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('keywords', data)
        self.assertIsInstance(data['keywords'], list)

    # def test_extract_keywords_empty_text(self):
    #     # Test that the endpoint returns a 200 status code with an error message
    #     data = {'text': ''}
    #     response = self.app.post('/extract-keywords', data=json.dumps(data), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     data = json.loads(response.data)
    #     self.assertIn('error', data)

    # def test_extract_keywords_invalid_input(self):
    #     # Test that the endpoint returns a 200 status code with an error message
    #     data = {' invalid_key': 'value'}
    #     response = self.app.post('/extract-keywords', data=json.dumps(data), content_type='application/json')
    #     self.assertEqual(response.status_code, 200)
    #     data = json.loads(response.data)
    #     self.assertIn('error', data)

    def test_extract_keywords_long_text(self):
        # Test that the endpoint returns a 200 status code with the expected response format
        data = {'text': 'This is a very long sample text for extracting keywords. It should still work.' * 100}
        response = self.app.post('/extract-keywords', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('keywords', data)
        self.assertIsInstance(data['keywords'], list)

    def test_weighted_prediction_with_non_zero_confidence(self):
        expert_predictions = [(0.5, 0.8), (0.3, 0.2)]
        expected_output = (0.5 * 0.8 + 0.3 * 0.2) / (0.8 + 0.2)
        self.assertAlmostEqual(weighted_prediction(expert_predictions), expected_output)

    def test_weighted_prediction_with_zero_confidence(self):
        expert_predictions = [(0.5, 0), (0.3, 0)]
        expected_output = 0
        self.assertEqual(weighted_prediction(expert_predictions), expected_output)

    # def test_weighted_prediction_with_negative_confidence(self):
    #     expert_predictions = [(0.5, -0.8), (0.3, -0.2)]
    #     with self.assertRaises(ValueError):
    #         weighted_prediction(expert_predictions)

    # def test_weighted_prediction_with_empty_list(self):
    #     expert_predictions = []
    #     with self.assertRaises(ValueError):
    #         weighted_prediction(expert_predictions)

if __name__ == '__main__':
    unittest.main()