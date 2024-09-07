import { Card, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import PredictionsTable from './RecentPredictionsTable';
import { subDays } from 'date-fns';
import { useGetPredictionsMutation } from 'src/store/apiquery/predictionsApiSlice'; // Import your mutation

// export type PredictionStatus = 'Reviewed' | 'Pending';

// export interface Prediction {
//   id: string;
//   truncatedText: string;
//   fakeStatus: boolean;
//   feedback: 'Good' | 'Bad';
//   createdAt: string;
//   status: PredictionStatus;
// }

function RecentPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [metadata, setMetadata] = useState(null);

  const [fetchPredictions, { isLoading, error }] = useGetPredictionsMutation();

  useEffect(() => {
    const fetchRecentPredictions = async () => {
      const formData = {
        sort: {
          field: 'createdAt',
          direction: 'desc'
        },
        filter: {
          status: { operator: 'NOT_EQUAL', value: 'FAILED' }
        }
      };

      try {
        const response = await fetchPredictions(formData).unwrap();
        setPredictions(response.content);
        setMetadata(response.metadata);
      } catch (err) {
        console.error('Error fetching predictions:', err);
      }
    };

    fetchRecentPredictions();
  }, [fetchPredictions]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>Error loading predictions...</p>;
  }

  return (
    <Card>
      <PredictionsTable predictions={predictions} />
    </Card>
  );
}

export default RecentPredictions;
