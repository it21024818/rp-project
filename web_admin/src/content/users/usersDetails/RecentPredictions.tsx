import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import PredictionsTable from 'src/content/predictions/predictionsList/RecentPredictionsTable';
import { useGetPredictionsMutation } from 'src/store/apiquery/predictionsApiSlice';
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
function RecentPredictions({ source }) {
  const [predictions, setPredictions] = useState([]);
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

  const [fetchPredictions, { isLoading, error }] = useGetPredictionsMutation();

  const fetchRecentPredictions = async (page: number) => {
    const formData = {
      pageNum: page,
      pageSize: metadata.pageSize,
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
      const response = await fetchPredictions(formData).unwrap();
      setPredictions(response.content);
      setMetadata(response.metadata);
    } catch (err) {
      console.error('Error fetching predictions:', err);
    }
  };

  useEffect(() => {
    fetchRecentPredictions(pageNum);
  }, [fetchPredictions, pageNum, source]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <p>Error loading predictions...</p>;
  }

  const handlePageChange = (newPage: number) => {
    setPageNum(newPage + 1);
  };

  return (
    <Card>
      <PredictionsTable
        predictions={predictions}
        metadata={metadata}
        page={pageNum - 1}
        limit={metadata.pageSize}
        onPageChange={handlePageChange}
        onLimitChange={(newLimit) =>
          setMetadata({ ...metadata, pageSize: newLimit })
        }
      />
    </Card>
  );
}

export default RecentPredictions;
