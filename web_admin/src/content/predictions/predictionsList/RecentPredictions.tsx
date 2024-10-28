import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import PredictionsTable from './RecentPredictionsTable';
import { useGetPredictionsMutation } from 'src/store/apiquery/predictionsApiSlice';
import Status404 from 'src/content/pages/Status/Status404';
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

function RecentPredictions() {
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
  const [pageSize, setPageSize] = useState(5);
  const [fetchPredictions, { isLoading, error }] = useGetPredictionsMutation();

  const fetchRecentPredictions = async (page: number, size: number) => {
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
      const response = await fetchPredictions(formData).unwrap();
      setPredictions(response.content);
      setMetadata(response.metadata);
    } catch (err) {
      console.error('Error fetching predictions:', err);
    }
  };

  useEffect(() => {
    fetchRecentPredictions(pageNum, pageSize);
  }, [fetchPredictions, pageNum, pageSize]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <Status404 />;
  }

  const handlePageChange = (newPage: number) => {
    setPageNum(newPage + 1);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageNum(1);
  };

  console.log(metadata);

  return (
    <Card>
      <PredictionsTable
        predictions={predictions}
        metadata={metadata}
        page={pageNum - 1}
        limit={pageSize}
        onPageChange={handlePageChange}
        onLimitChange={handlePageSizeChange}
      />
    </Card>
  );
}

export default RecentPredictions;
