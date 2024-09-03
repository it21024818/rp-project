import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/common/dtos/create-user.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { CoreService } from 'src/core/core.service';
import { FeedbackDocument } from 'src/feedback/feedback.schema';
import { FeedbackService } from 'src/feedback/feedback.service';
import { PredictionDocument } from 'src/prediction/prediction.schema';
import { PredictionService } from 'src/prediction/prediction.service';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly coreService: CoreService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly predictionsService: PredictionService,
    private readonly feedbackService: FeedbackService,
  ) {}

  async updateUser(id: string, userDto: CreateUserDto): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const updatedUser = await this.userModel.findByIdAndUpdate(id, userDto);

    if (updatedUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }
    return updatedUser;
  }

  async getUser(id: string): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const existingUser = await this.userModel.findById(id);

    if (existingUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }

    return existingUser;
  }

  async getUserByStripeCustomerId(id: string): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with stripe customer id '${id}'`);
    const existingUser = await this.userModel.findOne({ stripeCustomerId: id });

    if (existingUser === null) {
      this.logger.warn(`Could not find an existing user with stripe customere id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with stripe customer id '${id}' was not found`,
      });
    }

    return existingUser;
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    this.logger.log(`Attempting to find user with email '${email}'`);
    const existingUser = (await this.userModel.find({ email })).pop() ?? null;

    if (existingUser === null) {
      this.logger.warn(`Could not find an existing user with email '${email}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with email '${email}' was not found`,
      });
    }

    return existingUser;
  }

  async deleteUser(id: string) {
    this.logger.log(`Attempting to find user with id '${id}'`);
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (deletedUser === null) {
      this.logger.warn(`Could not find an existing user with id '${id}'`);
      throw new BadRequestException(ErrorMessage.USER_NOT_FOUND, {
        description: `User with id '${id}' was not found`,
      });
    }
    this.logger.log(`Deleted user with id '${id}'`);

    // Do not delete predictions and feedback as they are valuable data
  }

  async getUserDetails(id: string): Promise<[UserDocument, PredictionDocument[], FeedbackDocument[]]> {
    return await Promise.all([
      this.getUser(id),
      this.predictionsService.getByCreatedBy(id),
      this.feedbackService.getByCreatedBy(id),
    ]);
  }

  async getUserPage(pageRequest: PageRequest) {
    return await this.coreService.getDocumentPage(this.userModel, pageRequest);
  }
}
