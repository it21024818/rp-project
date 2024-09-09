import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import { Grid, Container } from '@mui/material';

import ProfileCover from './ProfileCover';
import { useGetUserQuery } from 'src/store/apiquery/usersApiSlice';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

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

function ManagementUserProfile() {
  const [users, setUser] = useState<{
    _id: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  useEffect(() => {
    // Get tokens and user from localStorage
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const id = users?._id;
  // Fetch the user data using useGetUserQuery hook
  const { data: user, error, isLoading } = useGetUserQuery(id);

  if (isLoading) {
    return (
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Details</title>
      </Helmet>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={12}>
            <ProfileCover user={user} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementUserProfile;
