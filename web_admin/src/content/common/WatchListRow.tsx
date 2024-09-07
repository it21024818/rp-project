import {
  Card,
  Box,
  Stack,
  Divider,
  styled,
  useTheme,
  Avatar,
  alpha
} from '@mui/material';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(0, 0, 1, -0.5)};
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

function WatchListRow() {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      animations: {
        enabled: false
      },
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: false
      }
    },
    labels: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    stroke: {
      curve: 'smooth',
      width: 2
    },
    yaxis: {
      show: false
    },
    colors: [theme.colors.success.main, theme.colors.error.main], // Different colors for positive and negative predictions
    grid: {
      padding: {
        top: 10,
        right: 5,
        bottom: 10,
        left: 5
      }
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: true
      },
      y: {
        formatter: function (value) {
          return `: ${value}`;
        }
      },
      marker: {
        show: true
      }
    }
  };

  const predictionData = [
    {
      name: 'Positive Predictions',
      data: [30, 40, 35, 50, 49, 60, 70]
    },
    {
      name: 'Negative Predictions',
      data: [20, 30, 25, 40, 45, 50, 55]
    }
  ];

  return (
    <Card>
      <Stack
        direction="row"
        justifyContent="space-evenly"
        alignItems="stretch"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={0}
      >
        <Box
          sx={{
            width: '100%',
            p: 3
          }}
        >
          <Box pt={2}>
            <Chart
              options={chartOptions}
              series={predictionData}
              type="line"
              height={100}
            />
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}

export default WatchListRow;
