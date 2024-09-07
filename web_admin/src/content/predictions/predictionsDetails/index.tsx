import { Helmet } from 'react-helmet-async';
import { Container, Grid, CircularProgress, Typography } from '@mui/material';
import PageHeaderCommon from '../../common/PageHeaderCommon';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';
import { Prediction } from './predictionsDetails';
import { useParams } from 'react-router';
import { useGetPredictionQuery } from 'src/store/apiquery/predictionsApiSlice';
import PredictionsDetails from './predictionsDetails';

function PredictionInside() {
  const { id } = useParams(); // Get the dynamic id from the route
  const { data: prediction, error, isLoading } = useGetPredictionQuery(id!); // Fetch prediction data

  return (
    <>
      <Helmet>
        <title>Predictions Details</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeaderCommon name={'Predictions Details'} />
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
                Error loading prediction.
              </Typography>
            ) : (
              <PredictionsDetails prediction={prediction as Prediction} />
            )}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default PredictionInside;
