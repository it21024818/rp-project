import { Helmet } from 'react-helmet-async';
import { Container, Grid } from '@mui/material';
import PageHeaderCommon from '../../common/PageHeaderCommon';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';
import { NewsSource } from 'src/models/models';
import NewsSourceDetails from './newsSourceDetails';
import RecentPredictions from 'src/content/predictions/predictionsList/RecentPredictions';

const news: NewsSource = {
  id: '1',
  name: 'OOver leaf',
  domain: 'google',
  createdAt: new Date().toISOString()
};

function NewsSourceInside() {
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
            <NewsSourceDetails news={news} />
          </Grid>
          <Grid item xs={12}>
            <RecentPredictions />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default NewsSourceInside;
