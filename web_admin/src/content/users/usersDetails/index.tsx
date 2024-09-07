import { Helmet } from 'react-helmet-async';
import { Container, Grid } from '@mui/material';
import PageHeaderCommon from '../../common/PageHeaderCommon';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';
import { User } from 'src/models/models';
import UsersDetails from './usersDetails';
import RecentPredictions from 'src/content/predictions/predictionsList/RecentPredictions';

const user: User = {
  id: '123',
  firstName: 'Disira',
  lastName: 'Thihan',
  email: 'disirathihan@gamil.com'
};

function UsersInside() {
  return (
    <>
      <Helmet>
        <title>Users Details</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeaderCommon name={'Users Details'} />
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
            <UsersDetails user={user} />
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

export default UsersInside;
