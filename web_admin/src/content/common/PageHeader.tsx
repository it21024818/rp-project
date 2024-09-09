import { Typography, Avatar, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

function PageHeader() {
  const userStat = {
    avatar: '/static/images/avatars/1.jpg'
  };

  const [user, setUser] = useState<{
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

  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(8),
            height: theme.spacing(8)
          }}
          variant="rounded"
          alt={user?.firstName}
          src={userStat.avatar}
        />
      </Grid>
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Welcome, {user?.firstName + ' ' + user?.lastName}!
        </Typography>
        <Typography variant="subtitle2">
          Welcome to admin dash board!
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
