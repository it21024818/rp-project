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

export interface NewsSource {
  _id: string;
  createdAt: string;
  name: string;
  identifications: string[];
  domain: string;
  __v: number;
}

interface RecentSourcesTableProps {
  newsSources: NewsSource[];
}

const applyFilters = (newsSources: NewsSource[]): NewsSource[] => {
  // Adjust filtering logic as needed
  return newsSources;
};

const applyPagination = (
  newsSources: NewsSource[],
  page: number,
  limit: number
): NewsSource[] => {
  return newsSources.slice(page * limit, page * limit + limit);
};

const RecentSourcesTable: FC<RecentSourcesTableProps> = ({ newsSources }) => {
  const [selectedNewsSources, setSelectedNewsSources] = useState<string[]>([]);
  const selectedBulkActions = selectedNewsSources.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handleSelectAllNewsSources = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedNewsSources(
      event.target.checked
        ? newsSources.map((newsSource) => newsSource._id)
        : []
    );
  };

  const handleSelectOneNewsSource = (
    event: ChangeEvent<HTMLInputElement>,
    newsSourceId: string
  ): void => {
    if (!selectedNewsSources.includes(newsSourceId)) {
      setSelectedNewsSources((prevSelected) => [...prevSelected, newsSourceId]);
    } else {
      setSelectedNewsSources((prevSelected) =>
        prevSelected.filter((id) => id !== newsSourceId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredNewsSources = applyFilters(newsSources);
  const paginatedNewsSources = applyPagination(
    filteredNewsSources,
    page,
    limit
  );
  const selectedSomeNewsSources =
    selectedNewsSources.length > 0 &&
    selectedNewsSources.length < newsSources.length;
  const selectedAllNewsSources =
    selectedNewsSources.length === newsSources.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && <CardHeader title="Recent News Sources" />}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllNewsSources}
                  indeterminate={selectedSomeNewsSources}
                  onChange={handleSelectAllNewsSources}
                />
              </TableCell>
              <TableCell>Source Name</TableCell>
              <TableCell>Domain</TableCell>
              <TableCell align="right">Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedNewsSources.map((newsSource) => {
              const isNewsSourceSelected = selectedNewsSources.includes(
                newsSource._id
              );
              return (
                <TableRow
                  hover
                  key={newsSource._id}
                  selected={isNewsSourceSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isNewsSourceSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneNewsSource(event, newsSource._id)
                      }
                      value={isNewsSourceSelected}
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
                      {newsSource.name}
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
                      {newsSource.domain}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {format(new Date(newsSource.createdAt), 'MMMM dd yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Source" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        component={Link}
                        to={`/admin/sources/details/${newsSource._id}`}
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
          count={filteredNewsSources.length}
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

RecentSourcesTable.propTypes = {
  newsSources: PropTypes.array.isRequired
};

RecentSourcesTable.defaultProps = {
  newsSources: []
};

export default RecentSourcesTable;
