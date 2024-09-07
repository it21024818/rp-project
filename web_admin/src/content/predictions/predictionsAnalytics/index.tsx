import { Helmet } from 'react-helmet-async';
import { Container, Grid } from '@mui/material';
import PageHeaderCommon from '../../common/PageHeaderCommon';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';

import LineGraph from '../../common/LineGraph';

function PredictionAnalytics() {
  return (
    <>
      <Helmet>
        <title>Prediction Analytics</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeaderCommon name={'Prediction Analytics'} />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <LineGraph namePage={'How many predictions are fake / not fake'} />
          </Grid>
          <Grid item xs={12}>
            <LineGraph
              namePage={'How many predictions are negative / positive'}
            />
          </Grid>
          <Grid item xs={12}>
            <LineGraph
              namePage={'How many predictions are left / right / center'}
            />
          </Grid>
          <Grid item xs={12}>
            <LineGraph
              namePage={
                'How many predictions have low / med / high text quality'
              }
            />
          </Grid>
          <Grid item xs={12}>
            <LineGraph
              namePage={'How many predictions are sarcastic / not sarcastic'}
            />
          </Grid>
          <Grid item xs={12}>
            <LineGraph
              namePage={'How many predictions are gen / hyp / rheto'}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default PredictionAnalytics;
