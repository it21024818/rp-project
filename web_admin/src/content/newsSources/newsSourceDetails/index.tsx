import { Helmet } from 'react-helmet-async';
import { Container, Grid, CircularProgress, Typography } from '@mui/material';
import PageHeaderCommon from '../../common/PageHeaderCommon';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';
import { useParams } from 'react-router';
import RecentPredictions from './RecentPredictions';
import NewsSourceDetails from './newsSourceDetails';
import { useGetnewsByIdQuery } from 'src/store/apiquery/newsApiSlice';

import FinalGraph from '../newsSourceAnalytics/finalAnalytics/LineGraph';
import SentimentGraph from '../newsSourceAnalytics/sentimentAnalytics/LineGraph';
import QualityGraph from '../newsSourceAnalytics/qualityAnalytics/LineGraph';
import SarcasmGraph from '../newsSourceAnalytics/sarcasmAnalytics/LineGraph';
import BiasGraph from '../newsSourceAnalytics/biasAnalytics/LineGraph';

export interface News {
  _id: string;
  createdAt: string;
  name: string;
  identifications: string[];
  domain: string;
  __v: number;
}

function NewsSourceInside() {
  const { id } = useParams(); // Get the dynamic id from the route
  const { data: newsSource, error, isLoading } = useGetnewsByIdQuery(id!); // Fetch news source data

  return (
    <>
      <Helmet>
        <title>News Source Details</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeaderCommon name={'News Source Details'} />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            {/* Handle loading, error, and display */}
            {isLoading ? (
              <CircularProgress />
            ) : error ? (
              <Typography variant="h6" color="error">
                Error loading news source details.
              </Typography>
            ) : (
              <NewsSourceDetails news={newsSource as News} />
            )}
          </Grid>
          <Grid item xs={12}>
            <FinalGraph
              namePage={'How many predictions are fake / not fake'}
              source={id}
            />
          </Grid>
          <Grid item xs={12}>
            <SentimentGraph
              namePage={'How many predictions are Sentiment'}
              source={id}
            />
          </Grid>
          <Grid item xs={12}>
            <QualityGraph
              namePage={'How many predictions are Quality'}
              source={id}
            />
          </Grid>
          <Grid item xs={12}>
            <SarcasmGraph
              namePage={'How many predictions are Sarcasm'}
              source={id}
            />
          </Grid>
          <Grid item xs={12}>
            <BiasGraph namePage={'How many predictions are Bias'} source={id} />
          </Grid>
          <Grid item xs={12}>
            <RecentPredictions source={id} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default NewsSourceInside;
