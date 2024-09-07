export type CryptoOrderStatus = 'completed' | 'pending' | 'failed';

export interface CryptoOrder {
  id: string;
  status: CryptoOrderStatus;
  orderDetails: string;
  orderDate: number;
  orderID: string;
  sourceName: string;
  sourceDesc: string;
  amountCrypto: number;
  amount: number;
  cryptoCurrency: string;
  currency: string;
}

export type PredictionStatus = 'Reviewed' | 'Pending';

export interface Prediction {
  id: string;
  truncatedText: string;
  fakeStatus: boolean;
  feedback: 'Good' | 'Bad';
  createdAt: string;
  status: PredictionStatus;
  newsSource: string;
  searchResults: string;
  keywordsIdentified: string[];
}

export interface Feedback {
  id: string;
  predictionId: string;
  fakeStatus: boolean;
  feedback: 'Good' | 'Bad';
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface NewsSource {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
}
