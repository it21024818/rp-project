import { Typography, Avatar, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function PageHeaderCommon({ name }) {
  const page = {
    name: 'Prediction Analytics'
  };
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {name}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeaderCommon;
