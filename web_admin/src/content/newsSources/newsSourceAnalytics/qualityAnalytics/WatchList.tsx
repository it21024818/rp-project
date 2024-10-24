import { MouseEvent, useState } from 'react';
import {
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  Typography,
  styled
} from '@mui/material';
import ViewWeekTwoToneIcon from '@mui/icons-material/ViewWeekTwoTone';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import WatchListColumn from './WatchListColumn';
import WatchListRow from './WatchListRow';
import { useGetnewsQualityAnalyticsQuery } from 'src/store/apiquery/newsApiSlice';

const EmptyResultsWrapper = styled('img')(
  ({ theme }) => `
      max-width: 100%;
      width: ${theme.spacing(66)};
      height: ${theme.spacing(34)};
`
);

function WatchList({ analyticsName, frequency, startDate, endDate, sourceId }) {
  const [tabs, setTab] = useState<string | null>('watch_list_columns');

  const {
    data: analytics,
    error,
    isLoading
  } = useGetnewsQualityAnalyticsQuery({
    frequency,
    startDate: startDate ? startDate.toISOString().split('T')[0] : null,
    endDate: endDate ? endDate.toISOString().split('T')[0] : null,
    sourceId
  });

  const handleViewOrientation = (
    _event: MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    setTab(newValue);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error loading data.</Typography>;
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3
        }}
      >
        <Typography
          sx={{
            pb: 3
          }}
          variant="h4"
        >
          {analyticsName}
        </Typography>
        <ToggleButtonGroup
          value={tabs}
          exclusive
          onChange={handleViewOrientation}
        >
          <ToggleButton disableRipple value="watch_list_columns">
            <ViewWeekTwoToneIcon />
          </ToggleButton>
          <ToggleButton disableRipple value="watch_list_rows">
            <TableRowsTwoToneIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {tabs === 'watch_list_columns' && (
        <WatchListColumn analytics={analytics} />
      )}

      {tabs === 'watch_list_rows' && <WatchListRow analytics={analytics} />}

      {!tabs && (
        <Card
          sx={{
            textAlign: 'center',
            p: 3
          }}
        >
          <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />

          <Typography
            align="center"
            variant="h2"
            fontWeight="normal"
            color="text.secondary"
            sx={{
              mt: 3
            }}
            gutterBottom
          >
            Click something, anything!
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 4
            }}
          >
            Maybe, a button?
          </Button>
        </Card>
      )}
    </>
  );
}

export default WatchList;
