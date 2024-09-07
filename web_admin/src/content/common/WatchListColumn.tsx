import { Card, Grid, useTheme } from '@mui/material';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

function WatchListColumn() {
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: false
      },
      zoom: {
        enabled: true
      }
    },
    fill: {
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [0, 100]
      }
    },
    colors: [theme.colors.success.main, theme.colors.error.main], // Positive and negative colors
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      width: 3
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center'
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
    xaxis: {
      labels: {
        show: true
      },
      axisBorder: {
        show: true
      },
      axisTicks: {
        show: true
      }
    },
    yaxis: {
      show: true,
      tickAmount: 5
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return `${seriesName}: `;
          }
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
      data: [30, 40, 35, 50, 49, 60, 70] // Replace with actual positive prediction data
    },
    {
      name: 'Negative Predictions',
      data: [20, 30, 25, 40, 45, 50, 55] // Replace with actual negative prediction data
    }
  ];

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={3}
    >
      <Grid item md={12} xs={12}>
        <Card
          sx={{
            overflow: 'visible'
          }}
        >
          <Chart
            options={chartOptions}
            series={chartData}
            type="area" // Use 'line' if you prefer lines instead of areas
            height={200}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default WatchListColumn;
