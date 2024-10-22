import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CoreService } from 'src/core/core.service';
import { FeedbackService } from 'src/feedback/feedback.service';
import { NewsSearchService } from 'src/news-search/news-search.service';
import { NewsSourceService } from 'src/news-source/news-source.service';
import { UsersService } from 'src/users/users.service';
import { PredictionFeignClient } from './prediction.feign';
import { Prediction } from './prediction.schema';
import { PredictionService } from './prediction.service';

describe('Prediction Test suite', () => {
  let service: PredictionService;
  let coreService: CoreService;
  let feedbackService: FeedbackService;
  let newsSearchService: NewsSearchService;
  let usersService: UsersService;
  let newsSourceService: NewsSourceService;
  let predictionModel: Model<Prediction>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PredictionService,
        { provide: CoreService, useValue: createMock<CoreService>() },
        { provide: FeedbackService, useValue: createMock<FeedbackService>() },
        { provide: NewsSearchService, useValue: createMock<NewsSearchService>() },
        { provide: UsersService, useValue: createMock<UsersService>() },
        { provide: NewsSourceService, useValue: createMock<NewsSourceService>() },
        { provide: PredictionFeignClient, useValue: createMock<PredictionFeignClient>() },
        { provide: getModelToken(Prediction.name), useValue: createMock<Model<Prediction>>() },
      ],
    }).compile();

    service = module.get<PredictionService>(PredictionService);
    coreService = module.get<CoreService>(CoreService);
    feedbackService = module.get<FeedbackService>(FeedbackService);
    newsSearchService = module.get<NewsSearchService>(NewsSearchService);
    usersService = module.get<UsersService>(UsersService);
    newsSourceService = module.get<NewsSourceService>(NewsSourceService);
    predictionModel = module.get<Model<Prediction>>(getModelToken(Prediction.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
