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

    def test_predict_empty_text(self):
        # Test that the predict endpoint returns a 200 status code with an error message
        response = self.app.post('/predict', data=json.dumps({'text': ''}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_predict_invalid_input(self):
        # Test that the predict endpoint returns a 200 status code with an error message
        response = self.app.post('/predict', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_extract_keywords_success(self):
        # Test that the endpoint returns a 200 status code with the expected response format
        data = {'text': 'This is a sample text for extracting keywords.'}
        response = self.app.post('/extract-keywords', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('keywords', data)
        self.assertIsInstance(data['keywords'], list)

    def test_extract_keywords_empty_text(self):
        # Test that the endpoint returns a 200 status code with an error message
        data = {'text': ''}
        response = self.app.post('/extract-keywords', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('error', data)

    def test_extract_keywords_invalid_input(self):
        # Test that the endpoint returns a 200 status code with an error message
        data = {' invalid_key': 'value'}
        response = self.app.post('/extract-keywords', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('error', data)

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

    def test_weighted_prediction_with_negative_confidence(self):
        expert_predictions = [(0.5, -0.8), (0.3, -0.2)]
        with self.assertRaises(ValueError):
            weighted_prediction(expert_predictions)

    def test_weighted_prediction_with_empty_list(self):
        expert_predictions = []
        with self.assertRaises(ValueError):
            weighted_prediction(expert_predictions)

class TestPredictEndpoint(unittest.TestCase):
    def setUp(self):
        # Create a test client for the Flask app
        self.app = app.test_client()

    def test_predict_endpoint_returns_200(self):
        # Test that the predict endpoint returns a 200 status code for a valid request
        response = self.app.post('/predict', data=json.dumps({'text': 'This is a sample text'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_predict_endpoint_returns_json(self):
        # Test that the predict endpoint returns a JSON response for a valid request
        response = self.app.post('/predict', data=json.dumps({'text': 'This is a sample text'}), content_type='application/json')
        self.assertEqual(response.content_type, 'application/json')

    def test_predict_endpoint_returns_prediction(self):
        # Test that the predict endpoint returns a prediction in the response for a valid request
        response = self.app.post('/predict', data=json.dumps({'text': 'This is a sample text'}), content_type='application/json')
        data = json.loads(response.data)
        self.assertIn('prediction', data)

    def test_predict_endpoint_handles_empty_text(self):
        # Test that the predict endpoint returns a 400 status code for an empty text input
        response = self.app.post('/predict', data=json.dumps({'text': ''}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_predict_endpoint_handles_invalid_input(self):
        # Test that the predict endpoint returns a 400 status code for an invalid input (e.g., missing 'text' key)
        response = self.app.post('/predict', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_predict_endpoint_handles_long_text(self):
        # Test that the predict endpoint can handle a long text input without error
        response = self.app.post('/predict', data=json.dumps({'text': 'This is a very long sample text for prediction. It should still work.' * 100}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

class TestPredictEndpointErrorHandling(unittest.TestCase):
    def setUp(self):
        # Create a test client for the Flask app
        self.app = app.test_client()

    def test_predict_endpoint_handles_internal_server_error(self):
        # Test that the predict endpoint returns a 500 status code for an internal server error
        # Simulate an internal server error by passing an invalid input
        response = self.app.post('/predict', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
        self.assertEqual(response.status_code, 500)

    def test_predict_endpoint_handles_bad_request(self):
        # Test that the predict endpoint returns a 400 status code for a bad request (e.g., invalid input)
        response = self.app.post('/predict', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

class TestPredictEndpointErrorHandling(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_predict_endpoint_handles_internal_server_error(self):
        # Simulate an internal server error
        response = self.app.post('/predict', data=json.dumps({'text': 'This is a sample text'}), content_type='application/json')
        self.assertEqual(response.status_code, 500)

    def test_predict_endpoint_handles_bad_request(self):
        # Simulate a bad request
        response = self.app.post('/predict', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

class TestExtractKeywordsEndpoint(unittest.TestCase):
    def setUp(self):
        # Create a test client for the Flask app
        self.app = app.test_client()

    def test_extract_keywords_endpoint_returns_200(self):
        # Test that the extract keywords endpoint returns a 200 status code for a valid request
        response = self.app.post('/extract-keywords', data=json.dumps({'text': 'This is a sample text'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_extract_keywords_endpoint_returns_json(self):
        # Test that the extract keywords endpoint returns a JSON response for a valid request
        response = self.app.post('/extract-keywords', data=json.dumps({'text': 'This is a sample text'}), content_type='application/json')
        self.assertEqual(response.content_type, 'application/json')

    def test_extract_keywords_endpoint_returns_keywords(self):
        # Test that the extract keywords endpoint returns a list of keywords in the response for a valid request
        response = self.app.post('/extract-keywords', data=json.dumps({'text': 'This is a sample text'}), content_type='application/json')
        data = json.loads(response.data)
        self.assertIn('keywords', data)

    def test_extract_keywords_endpoint_handles_empty_text(self):
        # Test that the extract keywords endpoint returns a 400 status code for an empty text input
        response = self.app.post('/extract-keywords', data=json.dumps({'text': ''}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_extract_keywords_endpoint_handles_invalid_input(self):
        # Test that the extract keywords endpoint returns a 400 status code for an invalid input (e.g., missing 'text' key)
        response = self.app.post('/extract-keywords', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_extract_keywords_endpoint_handles_long_text(self):
        # Test that the extract keywords endpoint can handle a long text input without error
        response = self.app.post('/extract-keywords', data=json.dumps({'text': 'This is a very long sample text for extracting keywords. It should still work.' * 100}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

class TestExtractKeywordsEndpointErrorHandling(unittest.TestCase):
    def setUp(self):
        # Create a test client for the Flask app
        self.app = app.test_client()

    def test_extract_keywords_endpoint_handles_internal_server_error(self):
        # Test that the extract keywords endpoint returns a 500 status code for an internal server error
        # Simulate an internal server error by passing an invalid input
        response = self.app.post('/extract-keywords', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
        self.assertEqual(response.status_code, 500)

    def test_extract_keywords_endpoint_handles_bad_request(self):
        # Test that the extract keywords endpoint returns a 400 status code for a bad request (e.g., invalid input)
        response = self.app.post('/extract-keywords', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

class TestWeightedPredictionEndpoint(unittest.TestCase):
    def setUp(self):
        # Create a test client for the Flask app
        self.app = app.test_client()

    def test_weighted_prediction_endpoint_returns_200(self):
        # Test that the weighted prediction endpoint returns a 200 status code for a valid request
        response = self.app.post('/weighted-prediction', data=json.dumps({'expert_predictions': [(0.5, 0.8), (0.3, 0.2)]}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_weighted_prediction_endpoint_returns_json(self):
        # Test that the weighted prediction endpoint returns a JSON response for a valid request
        response = self.app.post('/weighted-prediction', data=json.dumps({'expert_predictions': [(0.5, 0.8), (0.3, 0.2)]}), content_type='application/json')
        self.assertEqual(response.content_type, 'application/json')

    def test_weighted_prediction_endpoint_returns_prediction(self):
        # Test that the weighted prediction endpoint returns a prediction in the response for a valid request
        response = self.app.post('/weighted-prediction', data=json.dumps({'expert_predictions': [(0.5, 0.8), (0.3, 0.2)]}), content_type='application/json')
        data = json.loads(response.data)
        self.assertIn('prediction', data)

    def test_weighted_prediction_endpoint_handles_empty_expert_predictions(self):
        # Test that the weighted prediction endpoint returns a 400 status code for an empty list of expert predictions
        response = self.app.post('/weighted-prediction', data=json.dumps({'expert_predictions': []}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_weighted_prediction_endpoint_handles_invalid_input(self):
        # Test that the weighted prediction endpoint returns a 400 status code for an invalid input (e.g., missing 'expert_predictions' key)
        response = self.app.post('/weighted-prediction', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_weighted_prediction_endpoint_handles_non_zero_confidence(self):
        # Test that the weighted prediction endpoint can handle a non-zero confidence value without error
        response = self.app.post('/weighted-prediction', data=json.dumps({'expert_predictions': [(0.5, 0.8), (0.3, 0.2)]}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_weighted_prediction_endpoint_handles_zero_confidence(self):
        # Test that the weighted prediction endpoint can handle a zero confidence value without error
        response = self.app.post('/weighted-prediction', data=json.dumps({'expert_predictions': [(0.5, 0), (0.3, 0)]}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

class TestWeightedPredictionEndpointErrorHandling(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_weighted_prediction_endpoint_handles_internal_server_error(self):
        # Simulate an internal server error
        response = self.app.post('/weighted-prediction', data=json.dumps({'expert_predictions': [(0.5, 0.8), (0.3, 0.2)]}), content_type='application/json')
        self.assertEqual(response.status_code, 500)

    def test_weighted_prediction_endpoint_handles_bad_request(self):
        # Simulate a bad request
        response = self.app.post('/weighted-prediction', data=json.dumps({' invalid_key': 'value'}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()