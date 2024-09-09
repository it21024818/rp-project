import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../common/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';

import RecentActivity from './RecentActivity';
import Analytics from './AnalyticsDash';
import UsageGrowth from './UsageGrowth';

import { useGetusageAnalyticsQuery } from 'src/store/apiquery/predictionsApiSlice';

function DashboardLight() {
  const today = new Date();
  const startDate1 = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const [dateRange, setDateRange] = React.useState({
    startDate: startDate1,
    endDate: today,
    frequency: 'DAILY'
  });

  const { startDate, endDate, frequency } = dateRange;

  const {
    data: analytics,
    error,
    isLoading
  } = useGetusageAnalyticsQuery({
    frequency,
    startDate: startDate ? startDate.toISOString().split('T')[0] : null,
    endDate: endDate ? endDate.toISOString().split('T')[0] : null
  });

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
            <Analytics analytics={analytics} />
            <Grid item xs={12}>
              <UsageGrowth analytics={analytics} />
            </Grid>
          </Grid>
          <Grid item lg={4} xs={12}>
            <RecentActivity analytics={analytics} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardLight;
