import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import RecentNewsSourcesTable from './RecentNewsSourcesTable';
import { useGetnewsMutation } from 'src/store/apiquery/newsApiSlice';
import TableSkeleton from 'src/components/Skeleton/TableSkeleton';

export type News = {
  _id: string;
  createdAt: string;
  name: string;
  identifications: string[];
  domain: string;
  __v: number;
};

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

function RecentNews() {
  const [news, setNews] = useState<News[]>([]);
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

  const [fetchNews, { isLoading, error }] = useGetnewsMutation();

  const fetchRecentNews = async (page: number, size: number) => {
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
      const response = await fetchNews(formData).unwrap();
      setNews(response.content);
      setMetadata(response.metadata);
    } catch (err) {
      console.error('Error fetching News:', err);
    }
  };

  useEffect(() => {
    fetchRecentNews(pageNum, pageSize);
  }, [fetchNews, pageNum, pageSize]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <p>Error loading News...</p>;
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
      <RecentNewsSourcesTable
        newsSources={news}
        metadata={metadata}
        page={pageNum - 1}
        limit={pageSize}
        onPageChange={handlePageChange}
        onLimitChange={handlePageSizeChange}
      />
    </Card>
  );
}

export default RecentNews;
