import { Helmet } from 'react-helmet-async';
import { Container, Grid } from '@mui/material';
import PageHeaderCommon from '../../common/PageHeaderCommon';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';

import LineGraph from '../../common/LineGraph';

function FeedbackAnalytics() {
  return (
    <>
      <Helmet>
        <title>Feedback Analytics</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeaderCommon name={'Feedback Analytics'} />
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
            <LineGraph namePage={'Feedback Analytics'} />
          </Grid>
          <Grid item lg={8} xs={12}>
            {/* <Wallets /> */}
          </Grid>
          <Grid item lg={4} xs={12}>
            {/* <AccountSecurity /> */}
          </Grid>
          <Grid item xs={12}>
            {/* <WatchList /> */}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default FeedbackAnalytics;
