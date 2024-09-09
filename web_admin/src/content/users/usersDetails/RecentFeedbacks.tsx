import { Card, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import RecentFeedbackTable from 'src/content/feedbacks/feedbacksList/RecentFeedbacksTable';
import { subDays } from 'date-fns';
import { useGetfeedbacksMutation } from 'src/store/apiquery/feedbackApiSlice';

function RecentFeedbacks({ source }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [metadata, setMetadata] = useState(null);

  const [fetchFeedbacks, { isLoading, error }] = useGetfeedbacksMutation();

  useEffect(() => {
    const fetchRecentFeedbacks = async () => {
      const formData = {
        sort: {
          field: 'createdAt',
          direction: 'desc'
        },
        filter: {
          status: { operator: 'NOT_EQUAL', value: 'FAILED' },
          createdBy: { operator: 'EQUALS', value: source }
        }
      };

      try {
        const response = await fetchFeedbacks(formData).unwrap();
        setFeedbacks(response.content);
        setMetadata(response.metadata);
      } catch (err) {
        console.error('Error fetching Feedbacks:', err);
      }
    };

    fetchRecentFeedbacks();
  }, [fetchFeedbacks]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>Error loading Feedbacks...</p>;
  }

  return (
    <Card>
      <RecentFeedbackTable feedbacks={feedbacks} />
    </Card>
  );
}

export default RecentFeedbacks;
