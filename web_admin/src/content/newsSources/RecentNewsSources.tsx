import { Card } from '@mui/material';
import RecentNewsSourcesTable from './RecentNewsSourcesTable';
import { subDays } from 'date-fns';

export interface NewsSource {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
}

function RecentNewsSources() {
  const newsSources: NewsSource[] = [
    {
      id: '1',
      name: 'BBC News',
      domain: 'bbc.com',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'CNN',
      domain: 'cnn.com',
      createdAt: subDays(new Date(), 1).toISOString()
    },
    {
      id: '3',
      name: 'The New York Times',
      domain: 'nytimes.com',
      createdAt: subDays(new Date(), 5).toISOString()
    },
    {
      id: '4',
      name: 'The Guardian',
      domain: 'theguardian.com',
      createdAt: subDays(new Date(), 55).toISOString()
    },
    {
      id: '5',
      name: 'Al Jazeera',
      domain: 'aljazeera.com',
      createdAt: subDays(new Date(), 56).toISOString()
    },
    {
      id: '6',
      name: 'Reuters',
      domain: 'reuters.com',
      createdAt: subDays(new Date(), 33).toISOString()
    },
    {
      id: '7',
      name: 'Fox News',
      domain: 'foxnews.com',
      createdAt: new Date().toISOString()
    },
    {
      id: '8',
      name: 'NBC News',
      domain: 'nbcnews.com',
      createdAt: subDays(new Date(), 22).toISOString()
    },
    {
      id: '9',
      name: 'CBS News',
      domain: 'cbsnews.com',
      createdAt: subDays(new Date(), 11).toISOString()
    },
    {
      id: '10',
      name: 'ABC News',
      domain: 'abcnews.go.com',
      createdAt: subDays(new Date(), 123).toISOString()
    }
  ];

  return (
    <Card>
      <RecentNewsSourcesTable newsSources={newsSources} />
    </Card>
  );
}

export default RecentNewsSources;
