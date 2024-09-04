import { faker } from '@faker-js/faker';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { shuffle, take } from 'lodash';
import { Model } from 'mongoose';
import { Migration } from 'src/common/decorators/migration.decorator';
import { PoliticalLeaning } from 'src/common/enums/political-leaning.enum';
import { Reaction } from 'src/common/enums/reaction.enum';
import { Sarcasm } from 'src/common/enums/sarcasm.enum';
import { Sentiment } from 'src/common/enums/sentiment.enum';
import { UserRole } from 'src/common/enums/user-roles.enum';
import { Feedback } from 'src/feedback/feedback.schema';
import { Prediction } from 'src/prediction/prediction.schema';
import { User } from 'src/users/user.schema';

@Injectable()
export class FeedbackMockDataMigration implements OnModuleInit {
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
    @InjectModel(Prediction.name) private readonly predictionsModel: Model<Prediction>,
    @InjectModel(User.name) private readonly usersModel: Model<User>,
  ) {}

  @Migration('feedback-mock-data')
  async onModuleInit() {
    const predictions = await this.predictionsModel.find({}, {}, { limit: 2000 });
    const feedbacks: Feedback[] = [];

    // User feedback
    predictions.forEach(prediction => {
      const feedback: Feedback = {
        createdAt: new Date(),
        createdBy: prediction.createdBy,
        details: {
          bias: faker.datatype.boolean() ? faker.helpers.arrayElement(Object.values(PoliticalLeaning)) : undefined,
          isFake: faker.datatype.boolean() ? faker.datatype.boolean() : undefined,
          message: faker.datatype.boolean() ? faker.lorem.sentences() : undefined,
          sarcasm: faker.datatype.boolean() ? faker.helpers.arrayElement(Object.values(Sarcasm)) : undefined,
          sentiment: faker.datatype.boolean() ? faker.helpers.arrayElement(Object.values(Sentiment)) : undefined,
          textQuality: faker.datatype.boolean() ? faker.datatype.boolean() : undefined,
        },
        predictionId: prediction.id,
        reaction: faker.helpers.arrayElement(Object.values(Reaction)),
      };
      feedbacks.push(feedback);
    });

    // Admin feedback
    const users = await this.usersModel.find({ roles: { $in: [UserRole.ADMIN] } });
    const userIds = users.map(i => i.id);
    take(shuffle(predictions), 500).forEach(prediction => {
      const feedback: Feedback = {
        createdAt: new Date(),
        createdBy: faker.helpers.arrayElement(userIds),
        details: {
          bias: faker.helpers.arrayElement(Object.values(PoliticalLeaning)),
          isFake: faker.datatype.boolean(),
          message: faker.lorem.sentences(),
          sarcasm: faker.helpers.arrayElement(Object.values(Sarcasm)),
          sentiment: faker.helpers.arrayElement(Object.values(Sentiment)),
          textQuality: faker.datatype.boolean(),
        },
        predictionId: prediction.id,
        reaction: faker.helpers.arrayElement(Object.values(Reaction)),
      };
      feedbacks.push(feedback);
    });

    const shuffled = shuffle(feedbacks);
    this.feedbackModel.insertMany(shuffled);
  }
}
