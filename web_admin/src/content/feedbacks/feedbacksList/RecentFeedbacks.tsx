import { Card } from '@mui/material';
import { Feedback } from 'src/models/models';
import RecentFeedbackTable from './RecentFeedbacksTable';
import { subDays } from 'date-fns';

function RecentFeedback() {
  const feedbacks: Feedback[] = [
    {
      id: '1',
      predictionId: 'PRED12345',
      fakeStatus: true,
      feedback: 'Good',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      predictionId: 'PRED67890',
      fakeStatus: false,
      feedback: 'Bad',
      createdAt: subDays(new Date(), 1).toISOString()
    },
    {
      id: '3',
      predictionId: 'PRED11223',
      fakeStatus: true,
      feedback: 'Good',
      createdAt: subDays(new Date(), 5).toISOString()
    },
    {
      id: '4',
      predictionId: 'PRED44556',
      fakeStatus: false,
      feedback: 'Bad',
      createdAt: subDays(new Date(), 10).toISOString()
    },
    {
      id: '5',
      predictionId: 'PRED78901',
      fakeStatus: true,
      feedback: 'Good',
      createdAt: subDays(new Date(), 15).toISOString()
    }
  ];

  return (
    <Card>
      <RecentFeedbackTable feedbacks={feedbacks} />
    </Card>
  );
}

export default RecentFeedback;
