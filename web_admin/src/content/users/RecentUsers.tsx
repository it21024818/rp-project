import { Card } from '@mui/material';
import { User } from 'src/models/models';
import RecentUsersTable from './RecentUsersTable';

function RecentUsers() {
  const users: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com'
    },
    {
      id: '3',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com'
    },
    {
      id: '4',
      firstName: 'Bob',
      lastName: 'Brown',
      email: 'bob.brown@example.com'
    },
    {
      id: '5',
      firstName: 'Charlie',
      lastName: 'Williams',
      email: 'charlie.williams@example.com'
    },
    {
      id: '6',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com'
    },
    {
      id: '7',
      firstName: 'Frank',
      lastName: 'Miller',
      email: 'frank.miller@example.com'
    },
    {
      id: '8',
      firstName: 'Grace',
      lastName: 'Wilson',
      email: 'grace.wilson@example.com'
    },
    {
      id: '9',
      firstName: 'Henry',
      lastName: 'Moore',
      email: 'henry.moore@example.com'
    },
    {
      id: '10',
      firstName: 'Ivy',
      lastName: 'Taylor',
      email: 'ivy.taylor@example.com'
    }
  ];

  return (
    <Card>
      <RecentUsersTable users={users} />
    </Card>
  );
}

export default RecentUsers;
