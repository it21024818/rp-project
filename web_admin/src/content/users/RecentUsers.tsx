import { Card, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import RecentUsersTable from './RecentUsersTable';
import { useGetAllUsersListMutation } from 'src/store/apiquery/usersApiSlice';

function RecentUsers() {
  const [users, setUsers] = useState([]);
  const [metadata, setMetadata] = useState(null);

  const [fetchUsers, { isLoading, error }] = useGetAllUsersListMutation();

  useEffect(() => {
    const fetchRecentUsers = async () => {
      const formData = {
        sort: {
          field: 'createdAt',
          direction: 'desc'
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

    fetchRecentUsers();
  }, [fetchUsers]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>Error loading Users...</p>;
  }

  return (
    <Card>
      <RecentUsersTable users={users} />
    </Card>
  );
}

export default RecentUsers;
