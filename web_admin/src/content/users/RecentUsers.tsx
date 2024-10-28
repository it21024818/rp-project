import { Card } from '@mui/material';
import { useEffect, useState } from 'react';
import RecentUsersTable from './RecentUsersTable';
import { useGetAllUsersListMutation } from 'src/store/apiquery/usersApiSlice';
import TableSkeleton from 'src/components/Skeleton/TableSkeleton';

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

function RecentUsers() {
  const [users, setUsers] = useState([]);
  const [metadata, setMetadata] = useState<Metadata | null>({
    pageNum: 1,
    pageSize: 5,
    totalDocuments: 0,
    sort: { field: 'createdAt', direction: 'desc' },
    isFirst: true,
    isLast: false,
    totalPages: 1
  });
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [fetchUsers, { isLoading, error }] = useGetAllUsersListMutation();

  const fetchRecentUsers = async (page: number, size: number) => {
    const formData = {
      pageNum: page,
      pageSize: size,
      sort: {
        field: 'createdAt',
        direction: 'asc'
      },
      filter: {
        status: { operator: 'NOT_EQUAL', value: 'FAILED' }
      }
    };

    try {
      const response = await fetchUsers(formData).unwrap();
      setUsers(response.content);
      setMetadata(response.metadata);
    } catch (err) {
      console.error('Error fetching Users:', err);
    }
  };

  useEffect(() => {
    fetchRecentUsers(pageNum, pageSize);
  }, [fetchUsers, pageNum, pageSize]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <p>Error loading Users...</p>;
  }

  const handlePageChange = (newPage: number) => {
    setPageNum(newPage + 1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageNum(1);
  };

  return (
    <Card>
      <RecentUsersTable
        users={users}
        metadata={metadata}
        page={pageNum - 1}
        limit={pageSize}
        onPageChange={handlePageChange}
        onLimitChange={handlePageSizeChange}
      />
    </Card>
  );
}

export default RecentUsers;
