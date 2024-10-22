import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { CoreService } from 'src/core/core.service';
import { FeedbackService } from 'src/feedback/feedback.service';
import { PredictionService } from 'src/prediction/prediction.service';
import { User, UsersModel } from './user.schema';
import { UsersService } from './users.service';

describe('UsersService Test suite', () => {
  let service: UsersService;
  let coreService: CoreService;
  let predictionService: PredictionService;
  let feedbackService: FeedbackService;
  let userModel: UsersModel;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: CoreService, useValue: createMock<CoreService>() },
        { provide: PredictionService, useValue: createMock<PredictionService>() },
        { provide: getModelToken(User.name), useValue: createMock<UsersModel>() },
      ],
    })
      .useMocker(token => {
        return createMock<FeedbackService>();
      })
      .compile();

    service = module.get<UsersService>(UsersService);
    coreService = module.get<CoreService>(CoreService);
    predictionService = module.get<PredictionService>(PredictionService);
    feedbackService = module.get<FeedbackService>(FeedbackService);
    userModel = module.get<UsersModel>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
