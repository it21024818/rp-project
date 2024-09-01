import { faker } from '@faker-js/faker';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { Migration } from 'src/common/decorators/migration.decorator';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { User } from 'src/users/user.schema';

@Injectable()
export class UsersMockSeedMigration implements OnModuleInit {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  @Migration('users-mock-seed')
  async onModuleInit() {
    const users: User[] = [];

    for (let i = 0; i < 1000; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const user: User = {
        createdAt: new Date(),
        createdBy: 'MIGRATION',
        email: faker.internet.email({ firstName, lastName }),
        firstName,
        lastName,
        isAuthorized: true,
        password: await hash('password', 10),
        roles: [UserRole.USER],
        stripeCustomerId: 'stripe_' + faker.database.mongodbObjectId(),
        ...(faker.number.int({ max: 10 }) > 3
          ? {}
          : {
              subscription: {
                endingTs: faker.date.future({ years: 1 }),
                id: 'stripe_' + faker.database.mongodbObjectId(),
                planId: '66cb732ca8a0ab8ddc62b4a9',
                startedTs: faker.date.past(),
                status: faker.helpers.arrayElement(['ACTIVE', 'PAUSED', 'ENDED']),
              },
            }),
      };
      users.push(user);
    }
    this.userModel.insertMany(users);
  }
}