import { Helmet } from 'react-helmet-async';
import { Container, Grid } from '@mui/material';
import PageHeaderCommon from '../../common/PageHeaderCommon';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';

import LineGraph from '../../common/LineGraph';
import FinalGraph from './finalAnalytics/LineGraph';
import SentimentGraph from './sentimentAnalytics/LineGraph';
import QualityGraph from './qualityAnalytics/LineGraph';
import SarcasmGraph from './sarcasmAnalytics/LineGraph';
import BiasGraph from './biasAnalytics/LineGraph';

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
            <FinalGraph namePage={'How many predictions are fake / not fake'} />
          </Grid>
          <Grid item xs={12}>
            <SentimentGraph namePage={'How many predictions are Sentiment'} />
          </Grid>
          <Grid item xs={12}>
            <QualityGraph namePage={'How many predictions are Quality'} />
          </Grid>
          <Grid item xs={12}>
            <SarcasmGraph namePage={'How many predictions are Sarcasm'} />
          </Grid>
          <Grid item xs={12}>
            <BiasGraph namePage={'How many predictions are Bias'} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default PredictionAnalytics;
