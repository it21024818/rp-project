import { Helmet } from 'react-helmet-async';
import PageHeader from '../../common/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';

import RecentActivity from './RecentActivity';
import Analytics from './AnalyticsDash';
import UsageGrowth from './UsageGrowth';

function DashboardLight() {
  return (
    <>
      <Helmet>
        <title>LightHouse Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item lg={8} xs={12}>
            <Analytics />
            <Grid item xs={12}>
              <UsageGrowth />
            </Grid>
          </Grid>
          <Grid item lg={4} xs={12}>
            <RecentActivity />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardLight;
