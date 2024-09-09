import { Helmet } from 'react-helmet-async';
import { Container, Grid, CircularProgress, Typography } from '@mui/material';
import PageHeaderCommon from '../../common/PageHeaderCommon';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';
import { useParams } from 'react-router';
import { useGetUserQuery } from 'src/store/apiquery/usersApiSlice'; // Assuming you have this API slice
import UsersDetails from './usersDetails';
import RecentPredictions from './RecentPredictions';
import RecentFeedbacks from './RecentFeedbacks';

export type UserRole = 'USER' | 'ADMIN';
export type SubscriptionStatus = 'ACTIVE' | 'ENDED' | 'PAUSED';

export interface Subscription {
  endingTs: string;
  id: string;
  planId: string;
  startedTs: string;
  status: SubscriptionStatus;
}

export interface User {
  _id: string;
  createdBy: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: UserRole[];
  isAuthorized: boolean;
  subscription: Subscription;
  stripeCustomerId: string;
  __v: number;
}

function UserInside() {
  const { id } = useParams(); // Get the dynamic id from the route
  const { data: user, error, isLoading } = useGetUserQuery(id!); // Fetch user data

  return (
    <>
      <Helmet>
        <title>User Details</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeaderCommon name={'User Details'} />
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
                Error loading user details.
              </Typography>
            ) : (
              <UsersDetails user={user as User} />
            )}
          </Grid>
          <Grid item xs={12}>
            <RecentPredictions source={id} />
          </Grid>
          <Grid item xs={12}>
            <RecentFeedbacks source={id} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default UserInside;
