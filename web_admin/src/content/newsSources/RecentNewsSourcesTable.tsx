import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import {
  Tooltip,
  Divider,
  Box,
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
  Typography,
  useTheme,
  CardHeader
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Link } from 'react-router-dom';
import BulkActions from './BulkActions';

export interface NewsSource {
  _id: string;
  createdAt: string;
  name: string;
  identifications: string[];
  domain: string;
  __v: number;
}

export interface Metadata {
  pageNum: number;
  pageSize: number;
  totalDocuments: number;
}

interface RecentSourcesTableProps {
  newsSources: NewsSource[];
  metadata: Metadata;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

const RecentSourcesTable: FC<RecentSourcesTableProps> = ({
  newsSources,
  metadata,
  page,
  limit,
  onPageChange,
  onLimitChange
}) => {
  const [selectedNewsSources, setSelectedNewsSources] = useState<string[]>([]);
  const selectedBulkActions = selectedNewsSources.length > 0;
  const theme = useTheme();

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

  const selectedSomeNewsSources =
    selectedNewsSources.length > 0 &&
    selectedNewsSources.length < newsSources.length;
  const selectedAllNewsSources =
    selectedNewsSources.length === newsSources.length;

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
            {newsSources.map((newsSource) => {
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
                      onChange={(event) =>
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
                            background: theme.palette.primary.light
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
          count={metadata.totalDocuments}
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

export default RecentSourcesTable;
