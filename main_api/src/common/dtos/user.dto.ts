import { User } from 'src/users/user.schema';

export class UserDto {
  firstName: string;
  lastName: string;
  email: string;

  constructor(user: User) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
  }
}
