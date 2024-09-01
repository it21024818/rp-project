import { faker } from '@faker-js/faker';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { shuffle } from 'lodash';
import { Model } from 'mongoose';
import { Migration } from 'src/common/decorators/migration.decorator';
import { PoliticalLeaning } from 'src/common/enums/political-leaning.enum';
import { PredictionStatus } from 'src/common/enums/prediction-status.enum';
import { Sarcasm } from 'src/common/enums/sarcasm.enum';
import { Sentiment } from 'src/common/enums/sentiment.enum';
import { Text } from 'src/common/enums/text.enum';
import { NewsSource } from 'src/news-source/news-source.schema';
import { Prediction } from 'src/prediction/prediction.schema';
import { User } from 'src/users/user.schema';

@Injectable()
export class PredictionsMockDataMigration implements OnModuleInit {
  constructor(
    @InjectModel(NewsSource.name) private readonly newsSourcesModel: Model<NewsSource>,
    @InjectModel(User.name) private readonly usersModel: Model<User>,
    @InjectModel(Prediction.name) private readonly predictionsModel: Model<Prediction>,
  ) {}

  @Migration('predictions-mock-data')
  async onModuleInit() {
    const users = await this.usersModel.find({ roles: { $nin: ['ADMIN'] } });
    const newsSources = await this.newsSourcesModel.find({});
    const userIds = users.map(i => i.id);
    const newsSourceIds = newsSources.map(i => i.id);
    let predictions: Prediction[] = [];

    const generateConfidence = () => {
      return faker.number.float({ min: 0.5, fractionDigits: 2, max: 0.99 });
    };

    const generateResult = () => {
      return {
        finalFakeResult: faker.datatype.boolean(),
        biasFakeResult: {
          confidence: generateConfidence(),
          prediction: faker.datatype.boolean(),
        },
        sarcasmPresentResult: {
          confidence: generateConfidence(),
          prediction: faker.datatype.boolean(),
        },
        textFakeResult: {
          confidence: generateConfidence(),
          prediction: faker.datatype.boolean(),
        },
        sentimentFakeResult: {
          confidence: generateConfidence(),
          prediction: faker.datatype.boolean(),
        },
        sarcasmFakeResult: {
          confidence: generateConfidence(),
          prediction: faker.datatype.boolean(),
        },
        textQualityResult: {
          confidence: generateConfidence(),
          prediction: faker.datatype.boolean(),
        },
        biasResult: {
          confidence: generateConfidence(),
          prediction: faker.helpers.arrayElement(Object.values(PoliticalLeaning)),
        },
        sarcasmTypeResult: {
          confidence: generateConfidence(),
          prediction: faker.helpers.arrayElement(Object.values(Sarcasm)),
        },
        sentimentTypeResult: {
          confidence: generateConfidence(),
          prediction: faker.helpers.arrayElement(Object.values(Sentiment)),
        },
        sentimentTextTypeResult: {
          confidence: generateConfidence(),
          prediction: faker.helpers.arrayElement(Object.values(Text)),
        },
      };
    };

    // Generate FAILED predictions
    for (let i = 0; i < 500; i++) {
      const prediction: Prediction = {
        createdAt: new Date(),
        status: PredictionStatus.FAILED,
        createdBy: faker.helpers.arrayElement(userIds),
        text: faker.lorem.paragraph({ min: 2, max: 30 }),
        newsSourceId: faker.helpers.arrayElement(newsSourceIds),
        error: 'Couldn not perform search (Test Failure)',
        result: generateResult(),
      };
      predictions.push(prediction);
    }

    // Generate PREDICTING_FAKE_NEWS predictions
    for (let i = 0; i < 500; i++) {
      const prediction: Prediction = {
        createdAt: new Date(),
        createdBy: faker.helpers.arrayElement(userIds),
        text: faker.lorem.paragraph({ min: 2, max: 30 }),
        newsSourceId: faker.helpers.arrayElement(newsSourceIds),
        status: PredictionStatus.PREDICTING_FAKE_NEWS,
      };
      predictions.push(prediction);
    }

    // Generate STARTED predictions
    for (let i = 0; i < 500; i++) {
      const prediction: Prediction = {
        createdAt: new Date(),
        createdBy: faker.helpers.arrayElement(userIds),
        text: faker.lorem.paragraph({ min: 2, max: 30 }),
        newsSourceId: faker.helpers.arrayElement(newsSourceIds),
        status: PredictionStatus.STARTED,
      };
      predictions.push(prediction);
    }

    // Generate EXTRACTING_KEYWORDS predictions
    for (let i = 0; i < 500; i++) {
      const prediction: Prediction = {
        createdAt: new Date(),
        createdBy: faker.helpers.arrayElement(userIds),
        text: faker.lorem.paragraph({ min: 2, max: 30 }),
        newsSourceId: faker.helpers.arrayElement(newsSourceIds),
        status: PredictionStatus.EXTRACTING_KEYWORDS,
        result: generateResult(),
      };
      predictions.push(prediction);
    }

    // Generate SEARCHING_RESULTS predictions
    for (let i = 0; i < 500; i++) {
      const prediction: Prediction = {
        createdAt: new Date(),
        createdBy: faker.helpers.arrayElement(userIds),
        text: faker.lorem.paragraph({ min: 2, max: 30 }),
        keywords: faker.lorem.words(8).split(' '),
        newsSourceId: faker.helpers.arrayElement(newsSourceIds),
        status: PredictionStatus.SEARCHING_RESULTS,
        result: generateResult(),
      };
      predictions.push(prediction);
    }

    // Generate completed predictions
    for (let i = 0; i < 10000; i++) {
      const prediction: Prediction = {
        createdAt: new Date(),
        createdBy: faker.helpers.arrayElement(userIds),
        text: faker.lorem.paragraph({ min: 2, max: 30 }),
        keywords: faker.lorem.words(8).split(' '),
        newsSourceId: faker.helpers.arrayElement(newsSourceIds),
        status: PredictionStatus.COMPLETED,
        searchResults: Array(5)
          .fill(0)
          .map(_ => ({
            description: faker.lorem.paragraph({ min: 1, max: 4 }),
            link: faker.internet.url(),
            title: faker.lorem.words({ min: 4, max: 10 }),
          })),
        result: generateResult(),
      };
      predictions.push(prediction);
    }

    let shuffled = shuffle(predictions);
    const saved = await this.predictionsModel.insertMany(shuffled);
    const completed = saved.filter(i => i.status === PredictionStatus.COMPLETED);

    // Generate hashed predictions
    predictions = [];
    for (let i = 0; i < 2000; i++) {
      const selected = faker.helpers.arrayElement(completed);
      const prediction: Prediction = {
        createdAt: new Date(),
        createdBy: faker.helpers.arrayElement(userIds),
        text: faker.lorem.paragraph({ min: 2, max: 30 }),
        keywords: selected.keywords,
        newsSourceId: selected.id,
        status: PredictionStatus.COMPLETED,
        searchResults: selected.searchResults,
        result: selected.result,
      };
      predictions.push(prediction);
    }
    shuffled = shuffle(predictions);
    await this.predictionsModel.insertMany(shuffled);
  }
}
