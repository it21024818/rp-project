import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MockUtils } from 'src/common/utils/mock.utils';
import { CoreService } from 'src/core/core.service';
import { FeedbackService } from 'src/feedback/feedback.service';
import { PredictionService } from 'src/prediction/prediction.service';
import { User, UsersModel } from './user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let coreService: CoreService;
  let predictionService: PredictionService;
  let feedbackService: FeedbackService;
  let userModel: UsersModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CoreService,
          useValue: {} satisfies Partial<CoreService>,
        },
        {
          provide: PredictionService,
          useValue: {} satisfies Partial<PredictionService>,
        },
        {
          provide: FeedbackService,
          useValue: {} satisfies Partial<FeedbackService>,
        },
        {
          provide: getModelToken(User.name),
          useValue: MockUtils.mockModel(userModel),
        },
        UsersService,
      ],
    }).compile();

    coreService = module.get<CoreService>(CoreService);
    predictionService = module.get<PredictionService>(PredictionService);
    feedbackService = module.get<FeedbackService>(FeedbackService);
    userModel = module.get<UsersModel>(getModelToken(User.name));
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
