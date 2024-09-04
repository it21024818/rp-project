import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { Migration } from 'src/common/decorators/migration.decorator';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { User } from 'src/users/user.schema';

@Injectable()
export class UserMigration implements OnModuleInit {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  @Migration('seed-admin-data')
  async onModuleInit() {
    const admins: User[] = [
      {
        createdAt: new Date(),
        createdBy: 'MIGRATION',
        email: 'it21058578@my.sliit.lk',
        firstName: 'Tharindu',
        lastName: 'Gunasekera',
        // isAuthorized: true,
        // password: await hash('password', 10),
        roles: [UserRole.ADMIN, UserRole.USER],
      },
      {
        createdAt: new Date(),
        createdBy: 'MIGRATION',
        email: 'it21070358 @my.sliit.lk',
        firstName: 'Disira',
        lastName: 'Thihan',
        // isAuthorized: true,
        // password: await hash('password', 10),
        roles: [UserRole.ADMIN, UserRole.USER],
      },
      {
        createdAt: new Date(),
        createdBy: 'MIGRATION',
        email: 'it21024818@my.sliit.lk',
        firstName: 'Dinuka',
        lastName: 'Dissanayake',
        // isAuthorized: true,
        // password: await hash('password', 10),
        roles: [UserRole.ADMIN, UserRole.USER],
      },
      {
        createdAt: new Date(),
        createdBy: 'MIGRATION',
        email: 'it21028014@my.sliit.lk',
        firstName: 'Sansika',
        lastName: 'Kodithuwakku',
        // isAuthorized: true,
        // password: await hash('password', 10),
        roles: [UserRole.ADMIN, UserRole.USER],
      },
    ];
    this.userModel.insertMany(admins);
  }
}
