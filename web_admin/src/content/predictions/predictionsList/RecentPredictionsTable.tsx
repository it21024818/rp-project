import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
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
  CardHeader,
  SelectChangeEvent
} from '@mui/material';
import Label from 'src/components/Label';
import BulkActions from './BulkActions';
import EditTwoToneIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Link } from 'react-router-dom';

export type PredictionStatus = 'Pending' | 'Completed';

export interface Prediction {
  _id: string;
  createdBy: string;
  createdAt: string;
  text: string;
  searchResults: {
    title: string;
    description: string;
    link: string;
    thumbnail: { src: string; width: string; height: string }[] | null;
  }[];
  keywords: string[];
  status: PredictionStatus;
  result: {
    sarcasmPresentResult: { confidence: number; prediction: boolean };
    sarcasmTypeResult: { confidence: number; prediction: string };
    sarcasmFakeResult: { confidence: number; prediction: boolean };
    sentimentFakeResult: { confidence: number; prediction: boolean };
    sentimentTypeResult: { confidence: number; prediction: string };
    sentimentTextTypeResult: { confidence: number; prediction: string };
    textQualityResult: { confidence: number; prediction: boolean };
    textFakeResult: { confidence: number; prediction: boolean };
    biasResult: { confidence: number; prediction: string };
    biasFakeResult: { confidence: number; prediction: boolean };
    finalFakeResult: boolean;
  };
  sourcePredictionId: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Metadata {
  pageNum: number;
  pageSize: number;
  totalDocuments: number;
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  isFirst: boolean;
  isLast: boolean;
  totalPages: number;
}

interface PredictionsTableProps {
  predictions: Prediction[];
  metadata: Metadata;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

interface Filters {
  status?: string;
}

const getStatusLabel = (status: string): JSX.Element => {
  const map = {
    PENDING: { text: 'Pending', color: 'warning' },
    COMPLETED: { text: 'Completed', color: 'success' }
  };

  const { text, color } = map[status] || { text: 'Unknown', color: 'default' };
  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  predictions: Prediction[],
  filters: Filters
): Prediction[] => {
  return predictions.filter((prediction) => {
    if (filters.status && prediction.status !== filters.status) {
      return false;
    }
    return true;
  });
};

const PredictionsTable: FC<PredictionsTableProps> = ({
  predictions,
  metadata,
  page,
  limit,
  onPageChange,
  onLimitChange
}) => {
  const [selectedPredictions, setSelectedPredictions] = useState<string[]>([]);
  const selectedBulkActions = selectedPredictions.length > 0;
  const [filters, setFilters] = useState<Filters>({ status: null });

  const statusOptions = [
    { id: 'all', name: 'All' },
    { id: 'COMPLETED', name: 'COMPLETED' },
    { id: 'PENDING', name: 'PENDING' }
  ];

  const handleStatusChange = (event: SelectChangeEvent<string>): void => {
    const value = event.target.value !== 'all' ? event.target.value : null;
    setFilters((prevFilters) => ({ ...prevFilters, status: value }));
  };

  const handleSelectAllPredictions = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedPredictions(
      event.target.checked
        ? predictions.map((prediction) => prediction._id)
        : []
    );
  };

  const handleSelectOnePrediction = (
    event: ChangeEvent<HTMLInputElement>,
    predictionId: string
  ): void => {
    if (!selectedPredictions.includes(predictionId)) {
      setSelectedPredictions((prevSelected) => [...prevSelected, predictionId]);
    } else {
      setSelectedPredictions((prevSelected) =>
        prevSelected.filter((id) => id !== predictionId)
      );
    }
  };

  const filteredPredictions = applyFilters(predictions, filters);
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
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Predictions"
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
                  checked={selectedPredictions.length === predictions.length}
                  indeterminate={
                    selectedPredictions.length > 0 &&
                    selectedPredictions.length < predictions.length
                  }
                  onChange={handleSelectAllPredictions}
                />
              </TableCell>
              <TableCell>Prediction Details</TableCell>
              <TableCell>Prediction ID</TableCell>
              <TableCell>Fake / Not Fake</TableCell>
              <TableCell>Good / Bad based on feedback</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPredictions.map((prediction) => {
              const isPredictionSelected = selectedPredictions.includes(
                prediction._id
              );
              return (
                <TableRow
                  hover
                  key={prediction._id}
                  selected={isPredictionSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isPredictionSelected}
                      onChange={(event) =>
                        handleSelectOnePrediction(event, prediction._id)
                      }
                    />
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
                      {prediction.text}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {prediction._id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {prediction.result.finalFakeResult ? 'Fake' : 'Not Fake'}
                  </TableCell>
                  <TableCell>
                    {prediction.result.sentimentFakeResult.prediction
                      ? 'Good'
                      : 'Bad'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(prediction.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell align="center">
                    {getStatusLabel(prediction.status)}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.palette.primary.light
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        component={Link}
                        to={`/admin/predictions/details/${prediction._id}`}
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
          count={metadata?.totalDocuments ?? 0}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(event) =>
            onLimitChange(parseInt(event.target.value, 10))
          }
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

export default PredictionsTable;
