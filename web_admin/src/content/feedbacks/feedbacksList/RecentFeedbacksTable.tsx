import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader
} from '@mui/material';

import Label from 'src/components/Label';
import EditTwoToneIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import BulkActions from './BulkActions';
import { Link } from 'react-router-dom';

export type FeedbackReaction = 'GOOD' | 'BAD';

export interface Feedback {
  _id: string;
  createdBy: string;
  createdAt: string;
  predictionId: string;
  reaction: FeedbackReaction;
  details: {
    message: string;
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    sarcasm: 'GENERIC' | 'RHETORICAL_QUESTION' | 'HYPERBOLE';
    bias: 'LEFT' | 'CENTER' | 'RIGHT';
    isFake: boolean;
    textQuality?: boolean;
  };
}

interface RecentFeedbackTableProps {
  feedbacks: Feedback[];
}

interface Filters {
  feedback?: string;
}

// Get the feedback label
const getFeedbackLabel = (feedback: FeedbackReaction): JSX.Element => {
  const map = {
    GOOD: {
      text: 'Good',
      color: 'success'
    },
    BAD: {
      text: 'Bad',
      color: 'error'
    }
  };

  const { text, color }: any = map[feedback] || {
    text: 'Unknown',
    color: 'default'
  };

  return <Label color={color}>{text}</Label>;
};

// Apply filters to feedbacks
const applyFilters = (feedbacks: Feedback[], filters: Filters): Feedback[] => {
  return feedbacks.filter((feedback) => {
    let matches = true;

    if (filters.feedback && feedback.reaction !== filters.feedback) {
      matches = false;
    }

    return matches;
  });
};

// Apply pagination to feedbacks
const applyPagination = (
  feedbacks: Feedback[],
  page: number,
  limit: number
): Feedback[] => {
  return feedbacks.slice(page * limit, page * limit + limit);
};

const RecentFeedbackTable: FC<RecentFeedbackTableProps> = ({ feedbacks }) => {
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);
  const selectedBulkActions = selectedFeedbacks.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    feedback: null
  });

  const feedbackOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'GOOD',
      name: 'GOOD'
    },
    {
      id: 'BAD',
      name: 'BAD'
    }
  ];

  const handleFeedbackChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      feedback: value
    }));
  };

  const handleSelectAllFeedbacks = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedFeedbacks(
      event.target.checked ? feedbacks.map((feedback) => feedback._id) : []
    );
  };

  const handleSelectOneFeedback = (
    event: ChangeEvent<HTMLInputElement>,
    feedbackId: string
  ): void => {
    if (!selectedFeedbacks.includes(feedbackId)) {
      setSelectedFeedbacks((prevSelected) => [...prevSelected, feedbackId]);
    } else {
      setSelectedFeedbacks((prevSelected) =>
        prevSelected.filter((id) => id !== feedbackId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredFeedbacks = applyFilters(feedbacks, filters);
  const paginatedFeedbacks = applyPagination(filteredFeedbacks, page, limit);
  const selectedSomeFeedbacks =
    selectedFeedbacks.length > 0 && selectedFeedbacks.length < feedbacks.length;
  const selectedAllFeedbacks = selectedFeedbacks.length === feedbacks.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Feedback</InputLabel>
                <Select
                  value={filters.feedback || 'all'}
                  onChange={handleFeedbackChange}
                  label="Feedback"
                  autoWidth
                >
                  {feedbackOptions.map((feedbackOption) => (
                    <MenuItem key={feedbackOption.id} value={feedbackOption.id}>
                      {feedbackOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Recent Feedback"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllFeedbacks}
                  indeterminate={selectedSomeFeedbacks}
                  onChange={handleSelectAllFeedbacks}
                />
              </TableCell>
              <TableCell>Prediction ID</TableCell>
              <TableCell>Fake Status</TableCell>
              <TableCell align="center">Feedback</TableCell>
              <TableCell>Message</TableCell>
              <TableCell align="right">Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedFeedbacks.map((feedback) => {
              const isFeedbackSelected = selectedFeedbacks.includes(
                feedback._id
              );
              return (
                <TableRow
                  hover
                  key={feedback._id}
                  selected={isFeedbackSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isFeedbackSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneFeedback(event, feedback._id)
                      }
                      value={isFeedbackSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {feedback.predictionId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color={feedback.details.isFake ? 'error' : 'success'}
                      gutterBottom
                      noWrap
                    >
                      {feedback.details.isFake ? 'Fake' : 'Not Fake'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {getFeedbackLabel(feedback.reaction)}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                      maxWidth={300}
                    >
                      {feedback.details.message}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {format(new Date(feedback.createdAt), 'MMMM dd yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit Feedback" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        component={Link}
                        to={`/admin/predictions/details/${feedback.predictionId}`}
                        size="small"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredFeedbacks.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

RecentFeedbackTable.propTypes = {
  feedbacks: PropTypes.array.isRequired
};

RecentFeedbackTable.defaultProps = {
  feedbacks: []
};

export default RecentFeedbackTable;
