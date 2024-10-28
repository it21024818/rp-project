import { Card, Stack, Skeleton, Typography, Box } from '@mui/material';

function PredictionDetailsSkeleton() {
  return (
    <Card sx={{ padding: 3 }}>
      <Stack spacing={2}>
        {/* Title */}
        <Typography variant="h5">
          <Skeleton width="40%" />
        </Typography>
        <Typography variant="body1">
          <Skeleton width="60%" />
        </Typography>

        {/* Details */}
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" alignItems="center">
            <Skeleton variant="text" width="50%" />
          </Box>

          <Box display="flex" alignItems="center">
            <Skeleton variant="text" width="80%" />
          </Box>

          <Box display="flex" alignItems="center">
            <Skeleton variant="text" width="30%" />
          </Box>

          <Box display="flex" alignItems="center">
            <Skeleton variant="text" width="70%" />
          </Box>

          <Box display="flex" alignItems="center">
            <Skeleton variant="text" width="80%" />
          </Box>

          <Box display="flex" alignItems="center">
            <Skeleton
              variant="rectangular"
              width={70}
              height={30}
              sx={{ borderRadius: 1 }}
            />
          </Box>

          <Box display="flex" alignItems="center">
            <Skeleton variant="text" width="60%" />
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}

export default PredictionDetailsSkeleton;
