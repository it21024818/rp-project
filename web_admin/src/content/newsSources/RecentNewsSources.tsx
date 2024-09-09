import { Card, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import RecentNewsSourcesTable from './RecentNewsSourcesTable';
import { useGetnewsMutation } from 'src/store/apiquery/newsApiSlice';

export type News = {
  _id: string;
  createdAt: string;
  name: string;
  identifications: string[];
  domain: string;
  __v: number;
};

function RecentNews() {
  const [news, setNews] = useState([]);
  const [metadata, setMetadata] = useState(null);

  const [fetchNews, { isLoading, error }] = useGetnewsMutation();

  useEffect(() => {
    const fetchRecentNews = async () => {
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
        const response = await fetchNews(formData).unwrap();
        setNews(response.content);
        setMetadata(response.metadata);
      } catch (err) {
        console.error('Error fetching News:', err);
      }
    };

    fetchRecentNews();
  }, [fetchNews]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>Error loading News...</p>;
  }

  return (
    <Card>
      <RecentNewsSourcesTable newsSources={news} />
    </Card>
  );
}

export default RecentNews;
