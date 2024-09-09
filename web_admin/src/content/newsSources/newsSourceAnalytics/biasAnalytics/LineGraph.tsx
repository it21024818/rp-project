import {
  Button,
  Card,
  Box,
  Grid,
  Typography,
  useTheme,
  styled,
  Avatar,
  Divider,
  alpha,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
  colors
} from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Text from 'src/components/Text';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import WatchList from './WatchList';
import React from 'react';
import { DateRangePicker } from 'mui-daterange-picker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useGetnewsBiasAnalyticsQuery } from 'src/store/apiquery/newsApiSlice';
import { CardHeader, CardContent } from '@mui/material';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.5)};
  border-radius: 60px;
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
function LineGraph({ namePage, source }) {
  const theme = useTheme();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    colors: ['#ff9900', '#1c81c2', '#333', '#5c6ac0'],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return (val as number).toFixed(2) + '%';
      },
      style: {
        colors: [theme.colors.alpha.trueWhite[100]]
      },
      background: {
        enabled: true,
        foreColor: theme.colors.alpha.trueWhite[100],
        padding: 8,
        borderRadius: 4,
        borderWidth: 0,
        opacity: 0.3,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: theme.colors.alpha.black[70],
          opacity: 0.5
        }
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },
    labels: ['Fake', 'Not Fake'],
    legend: {
      labels: {
        colors: theme.colors.alpha.trueWhite[100]
      },
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const chartOptions2: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    colors: ['#ff9900', '#1c81c2', '#333', '#5c6ac0'],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return (val as number).toFixed(2) + '%';
      },
      style: {
        colors: [theme.colors.alpha.trueWhite[100]]
      },
      background: {
        enabled: true,
        foreColor: theme.colors.alpha.trueWhite[100],
        padding: 8,
        borderRadius: 4,
        borderWidth: 0,
        opacity: 0.3,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          color: theme.colors.alpha.black[70],
          opacity: 0.5
        }
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },
    labels: ['Left', 'Right', 'Center'],
    legend: {
      labels: {
        colors: theme.colors.alpha.trueWhite[100]
      },
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const [open, setOpen] = React.useState(false);

  const today = new Date();
  const startDate1 = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const [dateRange, setDateRange] = React.useState({
    startDate: startDate1,
    endDate: today,
    frequency: 'DAILY',
    sourceId: source
  });

  const toggle = () => setOpen(!open);

  const { startDate, endDate, frequency, sourceId } = dateRange;

  // Fetch data from API with the selected filters
  const {
    data: analytics,
    error,
    isLoading
  } = useGetnewsBiasAnalyticsQuery({
    frequency,
    startDate: startDate ? startDate.toISOString().split('T')[0] : null,
    endDate: endDate ? endDate.toISOString().split('T')[0] : null,
    sourceId
  });

  const handleDateChange = (range) => {
    setDateRange((prevState) => ({
      ...prevState,
      startDate: range.startDate,
      endDate: range.endDate
    }));
  };

  const handleFrequencyChange = (event) => {
    setDateRange((prevState) => ({
      ...prevState,
      frequency: event.target.value
    }));
  };

  return (
    <Card>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Button
            variant="contained"
            sx={{ marginLeft: 4, marginTop: 2 }}
            onClick={toggle}
          >
            Set Filters
          </Button>
        </Grid>

        {open && (
          <>
            <Grid item xs={12} md={8}>
              <DateRangePicker
                open={open}
                toggle={toggle}
                onChange={handleDateChange}
              />
            </Grid>
            <Divider />
            <Grid item xs={12} md={4}>
              <FormControl sx={{ padding: 10 }}>
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  sx={{
                    fontWeight: 'Bold',
                    color: colors.common
                  }}
                >
                  Data Display As
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={frequency}
                  onChange={handleFrequencyChange}
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="DAILY"
                    control={<Radio />}
                    label="Daily"
                  />
                  <FormControlLabel
                    value="WEEKLY"
                    control={<Radio />}
                    label="Weekly"
                  />
                  <FormControlLabel
                    value="MONTHLY"
                    control={<Radio />}
                    label="Monthly"
                  />
                  <FormControlLabel
                    value="YEARLY"
                    control={<Radio />}
                    label="Yearly"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={0}>
        <Grid item xs={12} md={6}>
          <Box p={4}>
            <Box>
              <WatchList
                analyticsName={namePage}
                frequency={frequency}
                startDate={startDate}
                endDate={endDate}
                sourceId={sourceId}
              />
            </Box>
          </Box>
        </Grid>

        {error ? (
          ''
        ) : (
          <Card sx={{ marginBottom: 3 }}>
            <CardContent>
              <Box sx={{ width: '100%' }}>
                <Tabs
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Fake/Not-Fake" {...a11yProps(0)} />
                  <Tab label="Bias Nature" {...a11yProps(1)} />
                </Tabs>
                <Divider sx={{ marginTop: 2 }} />
                <TabPanel value={value} index={0}>
                  <Grid container spacing={4}>
                    <Grid
                      xs={6}
                      sm={6}
                      item
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Chart
                        height={250}
                        options={chartOptions}
                        lables={['Left', 'Right', 'Center']}
                        series={
                          analytics
                            ? [analytics?.sum?.fake, analytics?.sum?.notFake]
                            : [0, 0]
                        }
                        type="donut"
                      />
                    </Grid>
                    <Grid
                      xs={6}
                      sm={6}
                      item
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <List
                        disablePadding
                        sx={{
                          width: '100%'
                        }}
                      >
                        <ListItem disableGutters>
                          <ListItemText
                            primary="Fake"
                            primaryTypographyProps={{
                              variant: 'h5',
                              noWrap: true
                            }}
                            secondary="Fake News"
                            secondaryTypographyProps={{
                              variant: 'subtitle2',
                              noWrap: true
                            }}
                          />
                          <Box>
                            <Typography align="right" variant="h4" noWrap>
                              {analytics
                                ? `${(
                                    (analytics?.sum?.fake /
                                      analytics?.sum?.total) *
                                    100
                                  ).toFixed(2)}%`
                                : '0%'}
                            </Typography>
                            <Text color="error">
                              {' '}
                              {analytics?.sum?.fake.toFixed(0)}
                            </Text>
                          </Box>
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText
                            primary="Not Fake"
                            primaryTypographyProps={{
                              variant: 'h5',
                              noWrap: true
                            }}
                            secondary="Not Fake News"
                            secondaryTypographyProps={{
                              variant: 'subtitle2',
                              noWrap: true
                            }}
                          />
                          <Box>
                            <Typography align="right" variant="h4" noWrap>
                              {analytics
                                ? `${(
                                    (analytics?.sum?.notFake /
                                      analytics?.sum?.total) *
                                    100
                                  ).toFixed(2)}%`
                                : '0%'}
                            </Typography>
                            <Text color="success">
                              {analytics?.sum?.notFake?.toFixed(0)}
                            </Text>
                          </Box>
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Grid container spacing={6}>
                    <Grid
                      xs={6}
                      sm={6}
                      item
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Chart
                        height={250}
                        options={chartOptions2}
                        series={
                          analytics
                            ? [
                                analytics?.sum?.left,
                                analytics?.sum?.right,
                                analytics?.sum?.center
                              ]
                            : [0, 0, 0]
                        }
                        type="donut"
                      />
                    </Grid>
                    <Grid xs={6} sm={6} item display="flex" alignItems="center">
                      <List
                        disablePadding
                        sx={{
                          width: '100%'
                        }}
                      >
                        <ListItem disableGutters>
                          <ListItemText
                            primary="Bias Left"
                            primaryTypographyProps={{
                              variant: 'h5',
                              noWrap: true
                            }}
                            secondary="Bias Left Count"
                            secondaryTypographyProps={{
                              variant: 'subtitle2',
                              noWrap: true
                            }}
                          />
                          <Box>
                            <Typography align="right" variant="h4" noWrap>
                              {analytics
                                ? `${(
                                    (analytics?.sum?.left /
                                      analytics?.sum?.total) *
                                    100
                                  ).toFixed(2)}%`
                                : '0%'}
                            </Typography>
                            <Text color="success">
                              {analytics?.sum?.left?.toFixed(0)}
                            </Text>
                          </Box>
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText
                            primary="Bias Right"
                            primaryTypographyProps={{
                              variant: 'h5',
                              noWrap: true
                            }}
                            secondary="Bias Right Count"
                            secondaryTypographyProps={{
                              variant: 'subtitle2',
                              noWrap: true
                            }}
                          />
                          <Box>
                            <Typography align="right" variant="h4" noWrap>
                              {analytics
                                ? `${(
                                    (analytics?.sum?.right /
                                      analytics?.sum?.total) *
                                    100
                                  ).toFixed(2)}%`
                                : '0%'}
                            </Typography>
                            <Text color="success">
                              {analytics?.sum?.right?.toFixed(0)}
                            </Text>
                          </Box>
                        </ListItem>
                        <ListItem disableGutters>
                          <ListItemText
                            primary="Bias Center"
                            primaryTypographyProps={{
                              variant: 'h5',
                              noWrap: true
                            }}
                            secondary="Bias Center Count"
                            secondaryTypographyProps={{
                              variant: 'subtitle2',
                              noWrap: true
                            }}
                          />
                          <Box>
                            <Typography align="right" variant="h4" noWrap>
                              {analytics
                                ? `${(
                                    (analytics?.sum?.center /
                                      analytics?.sum?.total) *
                                    100
                                  ).toFixed(2)}%`
                                : '0%'}
                            </Typography>
                            <Text color="success">
                              {analytics?.sum?.center?.toFixed(0)}
                            </Text>
                          </Box>
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </TabPanel>
              </Box>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Card>
  );
}

export default LineGraph;
