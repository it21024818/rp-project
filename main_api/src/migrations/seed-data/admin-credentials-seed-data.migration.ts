import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash, hashSync } from 'bcryptjs';
import { omit } from 'lodash';
import { Model } from 'mongoose';
import { Credentials } from 'src/auth/credentials.schema';
import { Migration } from 'src/common/decorators/migration.decorator';
import { AuthType } from 'src/common/enums/auth-type.enum';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { User } from 'src/users/user.schema';

@Injectable()
export class AdminCredentialsSeedDataMigration implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Credentials.name) private readonly credentialsModel: Model<Credentials>,
  ) {}

  @Migration('admin-credentials-seed-data-migration')
  async onModuleInit() {
    let admins = await this.userModel.find({ roles: { $in: [UserRole.ADMIN] } });
    const credentials: Credentials[] = admins.map(admin => ({
      createdAt: new Date(),
      createdBy: 'MIGRATION',
      userId: admin.id,
      strategies: [
        {
          createdAt: new Date(),
          type: AuthType.EMAIL_PASSWORD,
          isActive: true,
          password: hashSync('password', 10),
          createdBy: 'MIGRATION',
        },
      ],
    }));
    await this.credentialsModel.insertMany(credentials);
  }
}
