import {
  Button,
  Card,
  Grid,
  Box,
  CardContent,
  Typography,
  Avatar,
  alpha,
  Tooltip,
  CardActionArea,
  styled
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import MobileIcon from '@mui/icons-material/MobileFriendly';
import WebIcon from '@mui/icons-material/Web';
import ExtentionIcon from '@mui/icons-material/Extension';
import TrendingUp from '@mui/icons-material/TrendingUp';

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(2, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

const AvatarAddWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[10]};
        color: ${theme.colors.primary.main};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
`
);

const CardAddAction = styled(Card)(
  ({ theme }) => `
        border: ${theme.colors.primary.main} dashed 1px;
        height: 100%;
        color: ${theme.colors.primary.main};
        transition: ${theme.transitions.create(['all'])};
        
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }
        
        .MuiTouchRipple-root {
          opacity: .2;
        }
        
        &:hover {
          border-color: ${theme.colors.alpha.black[70]};
        }
`
);

function UsageGrowth() {
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3
        }}
      ></Box>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4} item>
          <Card
            sx={{
              px: 1
            }}
          >
            <CardContent>
              <Box
                display="flex"
                sx={{
                  py: 1
                }}
                alignItems="center"
              >
                <AvatarWrapper>
                  <MobileIcon />
                </AvatarWrapper>
                <Typography variant="h5" noWrap>
                  Mobile Usage
                  <br />
                  Progress
                </Typography>
              </Box>
              <Box
                display="flex"
                sx={{
                  py: 1
                }}
                alignItems="center"
              >
                <AvatarSuccess
                  sx={{
                    mr: 2
                  }}
                  variant="rounded"
                >
                  <TrendingUp fontSize="large" />
                </AvatarSuccess>
                <Box>
                  <Typography variant="h4">+ 20%</Typography>
                  <Typography variant="subtitle2" noWrap>
                    this month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <Card
            sx={{
              px: 1
            }}
          >
            <CardContent>
              <Box
                display="flex"
                sx={{
                  py: 1
                }}
                alignItems="center"
              >
                <AvatarWrapper>
                  <WebIcon />
                </AvatarWrapper>
                <Typography variant="h5" noWrap>
                  Web Usage
                  <br /> Progress
                </Typography>
              </Box>
              <Box
                display="flex"
                sx={{
                  py: 1
                }}
                alignItems="center"
              >
                <AvatarSuccess
                  sx={{
                    mr: 2
                  }}
                  variant="rounded"
                >
                  <TrendingUp fontSize="large" />
                </AvatarSuccess>
                <Box>
                  <Typography variant="h4">+ 20%</Typography>
                  <Typography variant="subtitle2" noWrap>
                    this month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          <Card
            sx={{
              px: 1
            }}
          >
            <CardContent>
              <Box
                display="flex"
                sx={{
                  py: 1
                }}
                alignItems="center"
              >
                <AvatarWrapper>
                  <ExtentionIcon />
                </AvatarWrapper>
                <Typography variant="h5" noWrap>
                  Extention Usage <br />
                  Progress
                </Typography>
              </Box>

              <Box
                display="flex"
                sx={{
                  py: 1
                }}
                alignItems="center"
              >
                <AvatarSuccess
                  sx={{
                    mr: 2
                  }}
                  variant="rounded"
                >
                  <TrendingUp fontSize="large" />
                </AvatarSuccess>
                <Box>
                  <Typography variant="h4">+ 20%</Typography>
                  <Typography variant="subtitle2" noWrap>
                    this month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default UsageGrowth;
