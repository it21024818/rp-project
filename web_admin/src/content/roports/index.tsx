import { Helmet } from 'react-helmet-async';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  Checkbox,
  Box,
  Tabs,
  Tab,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Download';
import { useState, SyntheticEvent } from 'react';
import Footer from 'src/components/Footer';
import { DateRangePicker } from 'mui-daterange-picker';
import {
  useGetrepotExcelQuery,
  useGetrepotCsvQuery
} from 'src/store/apiquery/predictionsApiSlice';

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

function Reports() {
  const [value, setValue] = useState(0);
  const today = new Date();

  const [dateRange, setDateRange] = useState({
    startDate: today,
    endDate: today,
    includeFeedback: true
  });

  const { startDate, endDate, includeFeedback } = dateRange;

  // Fetching data for Excel and CSV reports
  const { data: excelData, isLoading: isExcelLoading } = useGetrepotExcelQuery({
    includeFeedback,
    startDate: startDate ? startDate.toISOString().split('T')[0] : null,
    endDate: endDate ? endDate.toISOString().split('T')[0] : null
  });

  const { data: csvData, isLoading: isCsvLoading } = useGetrepotCsvQuery({
    includeFeedback,
    startDate: startDate ? startDate.toISOString().split('T')[0] : null,
    endDate: endDate ? endDate.toISOString().split('T')[0] : null
  });

  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(true);

  const toggle = () => setOpen(!open);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleDateChange = (range: { startDate: Date; endDate: Date }) => {
    setDateRange((prevState) => ({
      ...prevState,
      startDate: range.startDate,
      endDate: range.endDate
    }));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setDateRange((prevState) => ({
      ...prevState,
      includeFeedback: event.target.checked
    }));
  };

  // Download Excel report
  const handleExcelDownload = () => {
    if (excelData) {
      const blob = new Blob([excelData], { type: 'application/vnd.ms-excel' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'report.xlsx';
      link.click();
    }
  };

  // Download CSV report
  const handleCsvDownload = () => {
    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'report.csv';
      link.click();
    }
  };

  return (
    <>
      <Helmet>
        <title>System reports</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle
          heading="Reports"
          subHeading="Tabs make it easy to explore and switch between different views."
        />
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
            <Card>
              <CardHeader title="Download Your Reports Here" />
              <Divider />
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
                    <Tab
                      label="Get Prediction Report as Excel"
                      {...a11yProps(0)}
                    />
                    <Tab
                      label="Get Prediction Report as CSV"
                      {...a11yProps(1)}
                    />
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ marginLeft: 4, marginTop: 2, marginBottom: 4 }}
                    >
                      <Grid item xs={12} md={4}>
                        <Button variant="contained" onClick={toggle}>
                          Set Filters
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={4} container alignItems="center">
                        <Grid item xs={4} textAlign="right">
                          Include Feedback:
                        </Grid>
                        <Grid item xs={4}>
                          <Checkbox
                            checked={checked}
                            onChange={handleCheckboxChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </Grid>
                        <Grid item xs={4} textAlign="center">
                          <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={handleExcelDownload}
                            disabled={isExcelLoading}
                          >
                            {isExcelLoading ? 'Generating...' : 'Download'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={12}>
                        <DateRangePicker
                          open={open}
                          toggle={toggle}
                          onChange={handleDateChange}
                          initialDateRange={{
                            startDate,
                            endDate
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Divider />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      sx={{ marginLeft: 4, marginTop: 2, marginBottom: 4 }}
                    >
                      <Grid item xs={12} md={4}>
                        <Button variant="contained" onClick={toggle}>
                          Set Filters
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={4} container alignItems="center">
                        <Grid item xs={4} textAlign="right">
                          Include Feedback:
                        </Grid>
                        <Grid item xs={4}>
                          <Checkbox
                            checked={checked}
                            onChange={handleCheckboxChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </Grid>
                        <Grid item xs={4} textAlign="center">
                          <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={handleCsvDownload}
                            disabled={isCsvLoading}
                          >
                            {isCsvLoading ? 'Generating...' : 'Download'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={12}>
                        <DateRangePicker
                          open={open}
                          toggle={toggle}
                          onChange={handleDateChange}
                          initialDateRange={{
                            startDate,
                            endDate
                          }}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Reports;
