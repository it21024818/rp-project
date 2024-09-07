import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { Card, Grid, useTheme, CardHeader, Divider } from '@mui/material';

function Analytics() {
  const theme = useTheme();

  // Options for the login analytics chart
  const loginChartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: [theme.colors.info.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      categories: ['Mobile', 'Web', 'Extension'], // Categories for the x-axis
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        title: {
          formatter: function () {
            return 'Logins: ';
          }
        }
      }
    }
  };

  // Data for the login analytics chart
  const loginChartData = [
    {
      name: 'Logins',
      data: [100, 150, 75] // Replace with actual login data for mobile, web, extension
    }
  ];

  // Options for the prediction requests chart
  const predictionChartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    colors: [theme.colors.primary.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    xaxis: {
      categories: ['Mobile', 'Web', 'Extension'], // Categories for the x-axis
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
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%'
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        title: {
          formatter: function () {
            return 'Prediction Requests: ';
          }
        }
      }
    }
  };

  // Data for the prediction requests chart
  const predictionChartData = [
    {
      name: 'Prediction Requests',
      data: [80, 120, 90] // Replace with actual prediction request data for mobile, web, extension
    }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Login Activity" />
          <Divider />
          <Chart
            options={loginChartOptions}
            series={loginChartData}
            type="bar"
            height={300}
          />
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Prediction Activity" />
          <Divider />
          <Chart
            options={predictionChartOptions}
            series={predictionChartData}
            type="bar"
            height={300}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default Analytics;
