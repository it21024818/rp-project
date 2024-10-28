import { Card, Stack, Skeleton, Box, Typography } from '@mui/material';

function ProfileSkeleton() {
  return (
    <Stack spacing={4} marginTop={4}>
      {/* Header Text */}
      <Typography variant="h4">
        <Skeleton width="50%" />
      </Typography>
      <Typography variant="body1">
        <Skeleton width="70%" />
      </Typography>

      {/* Header Image */}
      <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />

      {/* Profile Info */}
      <Box display="flex" alignItems="center" mt={2}>
        {/* Profile Picture */}
        <Skeleton
          variant="circular"
          width={80}
          height={80}
          sx={{ marginRight: 2 }}
        />

        {/* User Details */}
        <Box>
          <Typography variant="h6">
            <Skeleton width={100} />
          </Typography>
          <Typography variant="body2">
            <Skeleton width={150} />
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}

export default ProfileSkeleton;
