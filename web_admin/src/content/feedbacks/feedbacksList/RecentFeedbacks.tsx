import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import FeedbacksTable from './RecentFeedbacksTable';
import { useGetfeedbacksMutation } from 'src/store/apiquery/feedbackApiSlice';
import TableSkeleton from 'src/components/Skeleton/TableSkeleton';

export interface Metadata {
  pageNum: number;
  pageSize: number;
  totalDocuments: number;
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  isFirst: boolean;
  isLast: boolean;
  totalPages: number;
}

function RecentFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [metadata, setMetadata] = useState<Metadata | null>({
    pageNum: 1,
    pageSize: 5,
    totalDocuments: 0,
    sort: { field: 'createdAt', direction: 'desc' },
    isFirst: true,
    isLast: false,
    totalPages: 1
  });
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [fetchFeedbacks, { isLoading, error }] = useGetfeedbacksMutation();

  const fetchRecentFeedbacks = async (page: number, size: number) => {
    const formData = {
      pageNum: page,
      pageSize: size,
      sort: {
        field: 'createdAt',
        direction: 'desc'
      },
      filter: {
        status: { operator: 'NOT_EQUAL', value: 'FAILED' }
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

  useEffect(() => {
    fetchRecentFeedbacks(pageNum, pageSize);
  }, [fetchFeedbacks, pageNum, pageSize]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <p>Error loading Feedbacks...</p>;
  }

  const handlePageChange = (newPage: number) => {
    setPageNum(newPage + 1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageNum(1);
  };

  return (
    <Card>
      <FeedbacksTable
        feedbacks={feedbacks}
        metadata={metadata}
        page={pageNum - 1}
        limit={pageSize}
        onPageChange={handlePageChange}
        onLimitChange={handlePageSizeChange}
      />
    </Card>
  );
}

export default RecentFeedbacks;
