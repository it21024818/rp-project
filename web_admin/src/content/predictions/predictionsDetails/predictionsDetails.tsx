import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Button,
  Link
} from '@mui/material';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
import Text from 'src/components/Text';
import Label from 'src/components/Label';
import React from 'react';

export interface Prediction {
  _id: string;
  createdBy: string;
  createdAt: string;
  text: string;
  searchResults: {
    title: string;
    description: string;
    link: string;
    thumbnail: { src: string; width: string; height: string }[] | null;
  }[];
  keywords: string[];
  status: PredictionStatus;
  result: {
    sarcasmPresentResult: { confidence: number; prediction: boolean };
    sarcasmTypeResult: { confidence: number; prediction: string };
    sarcasmFakeResult: { confidence: number; prediction: boolean };
    sentimentFakeResult: { confidence: number; prediction: boolean };
    sentimentTypeResult: { confidence: number; prediction: string };
    sentimentTextTypeResult: { confidence: number; prediction: string };
    textQualityResult: { confidence: number; prediction: boolean };
    textFakeResult: { confidence: number; prediction: boolean };
    biasResult: { confidence: number; prediction: string };
    biasFakeResult: { confidence: number; prediction: boolean };
    finalFakeResult: boolean;
  };
  sourcePredictionId: string;
  updatedAt: string;
  updatedBy: string;
}

function PredictionsDetails({ prediction }: { prediction: Prediction }) {
  console.log('prediction', prediction?._id);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Prediction Details
              </Typography>
              <Typography variant="subtitle2">
                Review the detailed information of the prediction
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                {/* Display Prediction ID */}
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Id:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>{prediction?._id}</b>
                  </Text>
                </Grid>

                {/* Display Prediction Text */}
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  my={2}
                  textAlign={{ sm: 'right' }}
                >
                  <Box pr={3} pb={2}>
                    Text:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9} my={2}>
                  <Divider />
                  <Text color="black">{prediction?.text}</Text>
                </Grid>

                {/* Display Prediction Results */}
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  my={2}
                  textAlign={{ sm: 'right' }}
                >
                  <Box pr={3} pb={2}>
                    Prediction Results:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9} my={2}>
                  <Divider />
                  <Text color="black">
                    {prediction?.result?.finalFakeResult ? 'Fake' : 'Not Fake'}
                  </Text>
                </Grid>

                {/* Display Search Results */}
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Search Results:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  {prediction?.searchResults?.map((result, index) => (
                    <Box key={index} mb={2}>
                      <Divider />
                      <Typography variant="h6" sx={{ my: 2 }}>
                        <Link href={result.link} target="_blank" rel="noopener">
                          {result.title}
                        </Link>
                      </Typography>
                      {result.thumbnail && (
                        <Box display="flex" gap={1}>
                          {result.thumbnail.map((thumb, thumbIndex) => (
                            <img
                              key={thumbIndex}
                              src={thumb.src}
                              width={thumb.width}
                              height={thumb.height}
                              alt="thumbnail"
                              style={{ borderRadius: '5px' }}
                            />
                          ))}
                        </Box>
                      )}
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ my: 2 }}
                      >
                        {result.description}
                      </Typography>
                    </Box>
                  ))}
                  <Divider />
                </Grid>
                {/* Display Keywords */}
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Keywords Identified:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">{prediction?.keywords?.join(', ')}</Text>
                </Grid>

                {/* Display Status */}
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Status:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Label
                    color={
                      prediction?.status === 'Reviewed' ? 'success' : 'warning'
                    }
                  >
                    {prediction?.status === 'Reviewed' ? (
                      <DoneTwoToneIcon fontSize="small" />
                    ) : null}
                    <b>{prediction?.status}</b>
                  </Label>
                </Grid>

                {/* Display Source Prediction Id */}
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  my={2}
                  textAlign={{ sm: 'right' }}
                >
                  <Box pr={3} pb={2}>
                    News Source:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9} my={2}>
                  <Divider />
                  <Text color="black">{prediction?.sourcePredictionId}</Text>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default PredictionsDetails;

export type PredictionStatus = 'Reviewed' | 'Pending';
