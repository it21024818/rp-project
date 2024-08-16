import unittest
from main import app, predict
from flask import json

class TestMLAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_predict_endpoint(self):
        # Test that the predict endpoint returns a 200 status code
        response = self.app.post('/predict', data=json.dumps({'text': 'This is a test sentence'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_predict_response(self):
        # Test that the predict endpoint returns a JSON response with the expected keys
        response = self.app.post('/predict', data=json.dumps({'text': 'This is a test sentence'}), content_type='application/json')
        data = json.loads(response.data)
        self.assertIn('final_score', data)
        self.assertIn('sarcasm_detection', data)
        self.assertIn('quality_assessment', data)
        self.assertIn('predicted_bias', data)
        self.assertIn('sentiment_prediction', data)

    def test_predict_empty_text(self):
        # Test that the predict endpoint returns an error when the text is empty
        response = self.app.post('/predict', data=json.dumps({'text': ''}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_predict_invalid_input(self):
        # Test that the predict endpoint returns an error when the input is invalid
        response = self.app.post('/predict', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()