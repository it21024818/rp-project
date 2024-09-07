import { Helmet } from 'react-helmet-async';
import { Container, Grid } from '@mui/material';
import PageHeaderCommon from '../common/PageHeaderCommon';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';

import RecentNewsSources from './RecentNewsSources';

function NewsSourceList() {
  return (
    <>
      <Helmet>
        <title>News Source List</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeaderCommon name={'News Source List'} />
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
            <RecentNewsSources />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default NewsSourceList;
