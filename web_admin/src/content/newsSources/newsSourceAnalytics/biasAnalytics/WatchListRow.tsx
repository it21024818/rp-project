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

interface Bin {
  notFake: number;
  fake: number;
  startDate: string;
}

function WatchListRow({ analytics }) {
  const theme = useTheme();

  const positiveData = analytics?.bins?.map((bin: Bin) => bin.notFake) || [];
  const negativeData = analytics?.bins?.map((bin: Bin) => bin.fake) || [];

  const chartOptions: ApexOptions = {
    chart: {
      animations: {
        enabled: true
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
    labels: analytics?.bins?.map((bin: Bin) => bin.startDate) || [],
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
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center'
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

  const chartData = [
    {
      name: 'Positive Predictions',
      data: positiveData
    },
    {
      name: 'Negative Predictions',
      data: negativeData
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
              series={chartData}
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
