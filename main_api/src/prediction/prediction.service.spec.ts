import { createMock } from '@golevelup/ts-jest';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Workbook } from 'exceljs';
import { when } from 'jest-when';
import { Model } from 'mongoose';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { PredictionResponseDto } from 'src/common/dtos/prediction-response.dto';
import { GetPredictionAsFileRequestDto } from 'src/common/dtos/request/get-prediction-as-file.request.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { Frequency } from 'src/common/enums/frequency.enum';
import { PredictionStatus } from 'src/common/enums/prediction-status.enum';
import { SubscriptionStatus } from 'src/common/enums/subscriptions-status.enum';
import { CoreService } from 'src/core/core.service';
import { FeedbackService } from 'src/feedback/feedback.service';
import { NewsSearchService } from 'src/news-search/news-search.service';
import { NewsSourceService } from 'src/news-source/news-source.service';
import { UsersService } from 'src/users/users.service';
import { PredictionFeignClient } from './prediction.feign';
import { Prediction, PredictionDocument } from './prediction.schema';
import { PredictionService } from './prediction.service';
import { PredictionUtil } from './prediction.util';

jest.mock('./prediction.util', () => ({
  PredictionUtil: {
    buildPredictionResult: jest.fn(),
  },
}));

describe('Prediction Test suite', () => {
  let service: PredictionService;
  let coreService: CoreService;
  let feedbackService: FeedbackService;
  let newsSearchService: NewsSearchService;
  let usersService: UsersService;
  let newsSourceService: NewsSourceService;
  let predictionModel: Model<Prediction>;
  let predictionFeignClient: PredictionFeignClient;

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
    predictionFeignClient = module.get<PredictionFeignClient>(PredictionFeignClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPrediction', () => {
    it('should return a prediction if found', async () => {
      // Given
      const id = 'predictionId';
      const foundPrediction = { _id: id, data: 'some data' };
      const predictionModel_findById = jest.spyOn(predictionModel, 'findById');
      when(predictionModel_findById)
        .calledWith(id)
        .mockResolvedValue(foundPrediction as never);

      // When
      const result = await service.getPrediction(id);

      // Then
      expect(predictionModel_findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(foundPrediction);
    });

    it('should throw BadRequestException if prediction not found', async () => {
      // Given
      const id = 'invalidPredictionId';
      const predictionModel_findById = jest.spyOn(predictionModel, 'findById');
      when(predictionModel_findById)
        .calledWith(id)
        .mockResolvedValue(null as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.getPrediction(id);
      } catch (e) {
        error = e;
      }

      // Then
      expect(predictionModel_findById).toHaveBeenCalledWith(id);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.PREDICTION_NOT_FOUND);
    });
  });

  describe('getPredictionDetails', () => {
    it('should return prediction, feedback, news source, and source prediction if all exist', async () => {
      // Given
      const id = 'predictionId';
      const prediction = { _id: id, newsSourceId: 'newsSourceId', sourcePredictionId: 'sourcePredictionId' };
      const feedback = [{ id: 'feedbackId', comment: 'Good prediction' }];
      const newsSource = { id: 'newsSourceId', name: 'BBC' };
      const sourcePrediction = { _id: 'sourcePredictionId', data: 'source data' };

      const service_getPrediction = jest.spyOn(service, 'getPrediction');
      const feedbackService_getFeedbackByPredictionId = jest.spyOn(feedbackService, 'getFeedbackByPredictionId');
      const newsSourceService_getNewsSource = jest.spyOn(newsSourceService, 'getNewsSource');

      when(service_getPrediction)
        .calledWith(id)
        .mockResolvedValue(prediction as never);
      when(feedbackService_getFeedbackByPredictionId)
        .calledWith(id)
        .mockResolvedValue(feedback as never);
      when(newsSourceService_getNewsSource)
        .calledWith(prediction.newsSourceId)
        .mockResolvedValue(newsSource as never);
      when(service_getPrediction)
        .calledWith(prediction.sourcePredictionId)
        .mockResolvedValue(sourcePrediction as never);

      // When
      const result = await service.getPredictionDetails(id);

      // Then
      expect(service_getPrediction).toHaveBeenCalledWith(id);
      expect(feedbackService_getFeedbackByPredictionId).toHaveBeenCalledWith(id);
      expect(newsSourceService_getNewsSource).toHaveBeenCalledWith(prediction.newsSourceId);
      expect(result).toEqual([prediction, feedback, newsSource, sourcePrediction]);
    });

    it('should return prediction, feedback, and undefined for news source and source prediction if they do not exist', async () => {
      // Given
      const id = 'predictionId';
      const prediction = { _id: id, newsSourceId: null, sourcePredictionId: null };
      const feedback = [{ id: 'feedbackId', comment: 'Good prediction' }];

      const service_getPrediction = jest.spyOn(service, 'getPrediction');
      const feedbackService_getFeedbackByPredictionId = jest.spyOn(feedbackService, 'getFeedbackByPredictionId');

      when(service_getPrediction)
        .calledWith(id)
        .mockResolvedValue(prediction as never);
      when(feedbackService_getFeedbackByPredictionId)
        .calledWith(id)
        .mockResolvedValue(feedback as never);

      // When
      const result = await service.getPredictionDetails(id);

      // Then
      expect(service_getPrediction).toHaveBeenCalledWith(id);
      expect(feedbackService_getFeedbackByPredictionId).toHaveBeenCalledWith(id);
      expect(result).toEqual([prediction, feedback, undefined, undefined]);
    });
  });

  describe('getByCreatedBy', () => {
    it('should return predictions created by the given user', async () => {
      // Given
      const createdBy = 'userId';
      const predictions = [{ id: 'prediction1' }, { id: 'prediction2' }];
      const predictionModel_find = jest.spyOn(predictionModel, 'find');
      when(predictionModel_find)
        .calledWith({ createdBy } as any)
        .mockResolvedValue(predictions as never);

      // When
      const result = await service.getByCreatedBy(createdBy);

      // Then
      expect(predictionModel_find).toHaveBeenCalledWith({ createdBy });
      expect(result).toEqual(predictions);
    });
  });

  describe('getPredictionFeedback', () => {
    it('should return feedback for the given prediction', async () => {
      // Given
      const id = 'predictionId';
      const feedback = [{ id: 'feedbackId', comment: 'Good prediction' }];
      const service_getPrediction = jest.spyOn(service, 'getPrediction');
      const feedbackService_getFeedbackByPredictionId = jest.spyOn(feedbackService, 'getFeedbackByPredictionId');

      when(service_getPrediction)
        .calledWith(id)
        .mockResolvedValue({ _id: id } as never);
      when(feedbackService_getFeedbackByPredictionId)
        .calledWith(id)
        .mockResolvedValue(feedback as never);

      // When
      const result = await service.getPredictionFeedback(id);

      // Then
      expect(service_getPrediction).toHaveBeenCalledWith(id);
      expect(feedbackService_getFeedbackByPredictionId).toHaveBeenCalledWith(id);
      expect(result).toEqual(feedback);
    });
  });

  describe('deletePrediction', () => {
    it('should delete a prediction and associated feedback if the prediction is found', async () => {
      // Given
      const id = 'predictionId';
      const deletedPrediction = { _id: id, data: 'some data' };

      const predictionModel_findByIdAndDelete = jest.spyOn(predictionModel, 'findByIdAndDelete');
      const feedbackService_deleteFeedbackByPredictionId = jest.spyOn(feedbackService, 'deleteFeedbackByPredictionId');

      when(predictionModel_findByIdAndDelete)
        .calledWith(id)
        .mockResolvedValue(deletedPrediction as never);
      when(feedbackService_deleteFeedbackByPredictionId)
        .calledWith(id)
        .mockResolvedValue(undefined as never);

      // When
      await service.deletePrediction(id);

      // Then
      expect(predictionModel_findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(feedbackService_deleteFeedbackByPredictionId).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException if the prediction is not found', async () => {
      // Given
      const id = 'invalidPredictionId';

      const predictionModel_findByIdAndDelete = jest.spyOn(predictionModel, 'findByIdAndDelete');
      when(predictionModel_findByIdAndDelete)
        .calledWith(id)
        .mockResolvedValue(null as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.deletePrediction(id);
      } catch (e) {
        error = e;
      }

      // Then
      expect(predictionModel_findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.PREDICTION_NOT_FOUND);
    });
  });

  describe('createPrediction', () => {
    it('should create a new prediction successfully when all conditions are met', async () => {
      // Given
      const text = 'This is a sufficiently long prediction text for testing Blah Blah Blah';
      const url = 'https://example.com';
      const userId = 'userId';
      const user = {
        _id: userId,
        subscription: { basic: { status: SubscriptionStatus.ACTIVE } },
        predictionsCount: 5,
        save: jest.fn(),
      };
      const domain = new URL(url).hostname;
      const newsSource = { id: 'newsSourceId' };
      const newPrediction = {
        status: PredictionStatus.STARTED,
        text,
        createdAt: new Date(),
        createdBy: userId,
        newsSourceId: newsSource.id,
        save: jest.fn(),
      };
      const savedPrediction = { ...newPrediction, _id: 'predictionId', save: jest.fn() };
      const predictionResult: PredictionResponseDto = {
        /* result data */
      } as any;
      const transformedResult = {
        /* transformed result */
      } as any;
      const keywords = ['keyword1', 'keyword2'];
      const searchResults = [{ title: 'Article 1' }, { title: 'Article 2' }];

      const usersService_getUser = jest.spyOn(usersService, 'getUser');
      const newsSourceService_getNewsSourceByIdentification = jest.spyOn(
        newsSourceService,
        'getNewsSourceByIdentification',
      );
      const predictionModel_findOne = jest.spyOn(predictionModel, 'findOne');
      const predictionModel_create = jest.spyOn(predictionModel, 'create');
      const predictionUtil_buildPredictionResult = jest.spyOn(PredictionUtil, 'buildPredictionResult');
      const predictionFeignClient_getPredictionForText = jest.spyOn(predictionFeignClient, 'getPredictionForText');
      const predictionFeignClient_extractKeywords = jest.spyOn(predictionFeignClient, 'extractKeywords');
      const newsSearchService_performSearch = jest.spyOn(newsSearchService, 'performSearch');

      when(usersService_getUser)
        .calledWith(userId)
        .mockResolvedValue(user as never);
      when(newsSourceService_getNewsSourceByIdentification)
        .calledWith(domain)
        .mockResolvedValue(newsSource as never);
      when(predictionModel_create)
        .calledWith(expect.any(Object))
        .mockResolvedValue(savedPrediction as never);
      when(predictionModel_findOne)
        .calledWith({
          text,
          status: PredictionStatus.COMPLETED,
          result: { $exists: true },
        })
        .mockResolvedValue(null as never);
      when(predictionFeignClient_getPredictionForText)
        .calledWith(text)
        .mockResolvedValue(predictionResult as never);
      when(predictionUtil_buildPredictionResult)
        .calledWith(predictionResult)
        .mockResolvedValue(transformedResult as never);
      when(predictionFeignClient_extractKeywords)
        .calledWith(text)
        .mockResolvedValue({ keywords } as never);
      when(newsSearchService_performSearch)
        .calledWith(keywords.join(' '))
        .mockResolvedValue(searchResults as never);

      // When
      const result = await service.createPrediction(text, url, userId);

      // Then
      expect(usersService_getUser).toHaveBeenCalledWith(userId);
      expect(newsSourceService_getNewsSourceByIdentification).toHaveBeenCalledWith(domain);
      expect(predictionModel_create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: PredictionStatus.STARTED,
          text,
          createdBy: userId,
        }),
      );
      expect(predictionFeignClient_getPredictionForText).toHaveBeenCalledWith(text);
      expect(predictionUtil_buildPredictionResult).toHaveBeenCalledWith(predictionResult);
      expect(predictionFeignClient_extractKeywords).toHaveBeenCalledWith(text);
      expect(newsSearchService_performSearch).toHaveBeenCalledWith(keywords.join(' '));
      expect(result).toEqual(savedPrediction);
      expect(user.save).toHaveBeenCalled();
      expect(savedPrediction.save).toHaveBeenCalledTimes(4); // Multiple updates during the process
    });

    it('should throw BadRequestException if the daily prediction quota for free users is exceeded', async () => {
      // Given
      const text = 'Prediction text';
      const url = 'https://example.com';
      const userId = 'userId';
      const user = {
        _id: userId,
        subscription: { basic: { status: SubscriptionStatus.ENDED } },
        predictionsCount: 10,
      };

      const usersService_getUser = jest.spyOn(usersService, 'getUser');
      when(usersService_getUser)
        .calledWith(userId)
        .mockResolvedValue(user as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.createPrediction(text, url, userId);
      } catch (e) {
        error = e;
      }

      // Then
      expect(usersService_getUser).toHaveBeenCalledWith(userId);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.PREDICTION_QUOTA_EXCEEDED);
    });

    it('should throw BadRequestException if the prediction text is too short', async () => {
      // Given
      const text = 'Too short';
      const url = 'https://example.com';
      const userId = 'userId';
      const user = {
        _id: userId,
        subscription: { basic: { status: SubscriptionStatus.ACTIVE } },
        predictionsCount: 10,
      };

      const usersService_getUser = jest.spyOn(usersService, 'getUser');
      when(usersService_getUser)
        .calledWith(userId)
        .mockResolvedValue(user as never);

      // When
      let error: Error | undefined = undefined;
      try {
        await service.createPrediction(text, url, userId);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.PREDICTION_TEXT_TOO_SHORT);
    });

    it('should handle news source creation when not found by domain', async () => {
      // Given
      const text = 'This is a sufficiently long prediction text for testing Blah Blah';
      const url = 'https://newdomain.com';
      const userId = 'userId';
      const user = {
        _id: userId,
        subscription: { basic: { status: SubscriptionStatus.ACTIVE } },
        predictionsCount: 5,
      };
      const domain = new URL(url).hostname;
      const newsSource = { id: 'newsSourceId' };
      const newPrediction = { status: PredictionStatus.STARTED, save: jest.fn() };
      const savedPrediction = { ...newPrediction, _id: 'predictionId', save: jest.fn() };

      const usersService_getUser = jest.spyOn(usersService, 'getUser');
      const newsSourceService_getNewsSourceByIdentification = jest.spyOn(
        newsSourceService,
        'getNewsSourceByIdentification',
      );
      const newsSourceService_createNewsSourceByDomain = jest.spyOn(newsSourceService, 'createNewsSourceByDomain');
      const predictionModel_create = jest.spyOn(predictionModel, 'create');

      when(usersService_getUser)
        .calledWith(userId)
        .mockResolvedValue(user as never);
      when(newsSourceService_getNewsSourceByIdentification)
        .calledWith(domain)
        .mockRejectedValue(new Error('Not found') as never);
      when(newsSourceService_createNewsSourceByDomain)
        .calledWith(domain, userId)
        .mockResolvedValue(newsSource as never);
      when(predictionModel_create).mockResolvedValue(savedPrediction as never);

      // When
      const result = await service.createPrediction(text, url, userId);

      // Then
      expect(usersService_getUser).toHaveBeenCalledWith(userId);
      expect(newsSourceService_getNewsSourceByIdentification).toHaveBeenCalledWith(domain);
      expect(newsSourceService_createNewsSourceByDomain).toHaveBeenCalledWith(domain, userId);
      expect(predictionModel_create).toHaveBeenCalled();
      expect(result).toEqual(savedPrediction);
    });
  });

  describe('getPredictionPage', () => {
    it('should retrieve a page of predictions from coreService', async () => {
      // Given
      const pageRequest: PageRequest = { pageNum: 1, pageSize: 10 };
      const pageResponse = {
        docs: [
          /* array of prediction documents */
        ],
        total: 20,
      };
      const coreService_getDocumentPage = jest.spyOn(coreService, 'getDocumentPage');

      when(coreService_getDocumentPage)
        .calledWith(predictionModel, pageRequest)
        .mockResolvedValue(pageResponse as never);

      // When
      const result = await service.getPredictionPage(pageRequest);

      // Then
      expect(coreService_getDocumentPage).toHaveBeenCalledWith(predictionModel, pageRequest);
      expect(result).toEqual(pageResponse);
    });

    it('should throw an error if coreService throws', async () => {
      // Given
      const pageRequest: PageRequest = { pageNum: 1, pageSize: 10 };
      const coreService_getDocumentPage = jest.spyOn(coreService, 'getDocumentPage');

      when(coreService_getDocumentPage)
        .calledWith(predictionModel, pageRequest)
        .mockRejectedValue(new Error('Error fetching predictions') as never);

      // When
      let error: Error | undefined;
      try {
        await service.getPredictionPage(pageRequest);
      } catch (e) {
        error = e;
      }

      // Then
      expect(coreService_getDocumentPage).toHaveBeenCalledWith(predictionModel, pageRequest);
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Error fetching predictions');
    });
  });

  describe('getPredictionsAsWorkbook', () => {
    it('should create a workbook with prediction and feedback details', async () => {
      // Given
      const userId = 'user123';
      const options: GetPredictionAsFileRequestDto = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        includeFeedback: true,
      };
      const predictions = [
        {
          id: 'pred1',
          text: 'Prediction 1',
          result: {
            finalFakeResult: 'Fake',
            sarcasmPresentResult: { prediction: 'Sarcasm' },
            sentimentTypeResult: { prediction: 'Positive' },
            biasResult: { prediction: 'None' },
            textQualityResult: { prediction: 'High' },
          },
        },
        {
          id: 'pred2',
          text: 'Prediction 2',
          result: {
            finalFakeResult: 'Real',
            sarcasmPresentResult: { prediction: null },
            sentimentTypeResult: { prediction: 'Negative' },
            biasResult: { prediction: 'High' },
            textQualityResult: { prediction: 'Medium' },
          },
        },
      ];
      const feedbacks = [
        {
          id: 'feedback1',
          predictionId: 'pred1',
          reaction: 'Positive',
          details: {
            message: 'Good prediction',
            isFake: false,
            sarcasm: false,
            sentiment: 'Positive',
            bias: 'None',
            textQuality: 'High',
          },
        },
        {
          id: 'feedback2',
          predictionId: 'pred1',
          reaction: 'Negative',
          details: {
            message: 'Incorrect',
            isFake: true,
            sarcasm: true,
            sentiment: 'Negative',
            bias: 'High',
            textQuality: 'Low',
          },
        },
        {
          id: 'feedback3',
          predictionId: 'pred2',
          reaction: 'Neutral',
          details: {
            message: 'Okay',
            isFake: false,
            sarcasm: false,
            sentiment: 'Neutral',
            bias: 'None',
            textQuality: 'Medium',
          },
        },
      ];

      const getFeedbackByPredictionIds = jest.spyOn(feedbackService, 'getFeedbackByPredictionIds');
      const predictionModel_find = jest.spyOn(predictionModel, 'find');

      when(predictionModel_find)
        .calledWith({
          createdAt: { $gte: options.startDate, $lte: options.endDate },
        } as any)
        .mockResolvedValue(predictions as never);

      when(getFeedbackByPredictionIds)
        .calledWith(predictions.map(p => p.id))
        .mockResolvedValue(feedbacks as never);

      // When
      const result = await service.getPredictionsAsWorkbook(userId, options);

      // Then
      expect(result.creator).toBe(userId);
      expect(result.lastModifiedBy).toBe(userId);
      expect(result.created).toBeInstanceOf(Date);
      expect(result.modified).toBeInstanceOf(Date);

      const sheet = result.getWorksheet('Predictions')!;
      expect(sheet.getRow(1).values).toEqual([
        undefined,
        'Prediction Id*',
        'Text*',
        'Feedback Reaction',
        'Feedback Message',
        'Result',
        'Result',
        'Result',
        'Result',
        'Result',
      ]);
      expect(sheet.getRow(2).values).toEqual([
        undefined,
        'Prediction Id*',
        'Text*',
        'Feedback Reaction',
        'Feedback Message',
        'Fake',
        'Sarcasm',
        'Sentiment',
        'Bias',
        'Text Quality',
      ]);

      expect(sheet.getColumn(1).width).toBe(26.0);
      expect(sheet.getColumn(2).width).toBe(35.0);

      expect(sheet.getRow(3).values).toEqual([
        undefined,
        'pred1',
        'Prediction 1',
        undefined,
        undefined,
        'Fake',
        undefined,
        'Positive',
        'None',
        'High',
      ]);
      expect(sheet.getRow(4).values).toEqual([
        undefined,
        'pred1',
        'Prediction 1',
        'Positive',
        'Good prediction',
        false,
        false,
        'Positive',
        'None',
        'High',
      ]);
      expect(sheet.getRow(5).values).toEqual([
        undefined,
        'pred1',
        'Prediction 1',
        'Negative',
        'Incorrect',
        true,
        true,
        'Negative',
        'High',
        'Low',
      ]);
      expect(sheet.getRow(6).values).toEqual([
        undefined,
        'pred2',
        'Prediction 2',
        undefined,
        undefined,
        'Real',
        undefined,
        'Negative',
        'High',
        'Medium',
      ]);
      expect(sheet.getRow(7).values).toEqual([
        undefined,
        'pred2',
        'Prediction 2',
        'Neutral',
        'Okay',
        false,
        false,
        'Neutral',
        'None',
        'Medium',
      ]);

      expect(sheet.views).toEqual([{ state: 'frozen', xSplit: 0, ySplit: 2 }]);
    });

    it('should handle cases when no predictions are found', async () => {
      // Given
      const userId = 'user123';
      const options: GetPredictionAsFileRequestDto = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        includeFeedback: true,
      };

      const predictionModel_find = jest.spyOn(predictionModel, 'find');
      when(predictionModel_find)
        .calledWith({
          createdAt: { $gte: options.startDate, $lte: options.endDate },
        } as any)
        .mockResolvedValue([] as never);

      // When
      const result = await service.getPredictionsAsWorkbook(userId, options);

      // Then
      expect(result.creator).toBe(userId);
      expect(result.lastModifiedBy).toBe(userId);
      const sheet = result.getWorksheet('Predictions')!;

      expect(sheet.getRow(1).values).toEqual([
        undefined,
        'Prediction Id*',
        'Text*',
        'Feedback Reaction',
        'Feedback Message',
        'Result',
        'Result',
        'Result',
        'Result',
        'Result',
      ]);
      expect(sheet.getRow(2).values).toEqual([
        undefined,
        'Prediction Id*',
        'Text*',
        'Feedback Reaction',
        'Feedback Message',
        'Fake',
        'Sarcasm',
        'Sentiment',
        'Bias',
        'Text Quality',
      ]);
      expect(sheet.rowCount).toBe(2); // Only header rows
    });

    it('should handle errors during prediction retrieval gracefully', async () => {
      // Given
      const userId = 'user123';
      const options: GetPredictionAsFileRequestDto = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        includeFeedback: true,
      };
      const predictionModel_find = jest.spyOn(predictionModel, 'find');
      when(predictionModel_find)
        .calledWith({
          createdAt: { $gte: options.startDate, $lte: options.endDate },
        } as any)
        .mockRejectedValue(new Error('Error fetching predictions') as never);

      // When
      let error: Error | undefined;
      try {
        await service.getPredictionsAsWorkbook(userId, options);
      } catch (e) {
        error = e;
      }

      // Then
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Error fetching predictions');
    });
  });

  describe('getSentimentAnalytics', () => {
    it('should return sentiment analytics when all parameters are valid', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'sourceId';
      const expectedAnalytics = {
        /* mocked analytics data */
      };

      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics)
        .calledWith(
          expect.objectContaining({
            model: predictionModel,
            filters: { newsSourceId },
            options: {
              startDate,
              endDate,
              frequency,
            },
          }),
        )
        .mockResolvedValue(expectedAnalytics as never);

      // When
      const result = await service.getSentimentAnalytics(startDate, endDate, frequency, newsSourceId);

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          model: predictionModel,
          filters: { newsSourceId },
          options: {
            startDate,
            endDate,
            frequency,
          },
        }),
      );
      expect(result).toEqual(expectedAnalytics);
    });

    it('should return sentiment analytics without newsSourceId', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const expectedAnalytics = {
        /* mocked analytics data */
      };

      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics)
        .calledWith(
          expect.objectContaining({
            filters: { newsSourceId: undefined },
          }),
        )
        .mockResolvedValue(expectedAnalytics as never);

      // When
      const result = await service.getSentimentAnalytics(startDate, endDate, frequency);

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalled();
      expect(result).toEqual(expectedAnalytics);
    });

    it('should throw an error if coreService throws an error', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'sourceId';
      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics).mockRejectedValue(
        new Error('Error fetching analytics') as never,
      );

      // When
      let error: Error | undefined;
      try {
        await service.getSentimentAnalytics(startDate, endDate, frequency, newsSourceId);
      } catch (e) {
        error = e;
      }

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Error fetching analytics');
    });
  });

  describe('getBiasAnalytics', () => {
    it('should return bias analytics when all parameters are valid', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'sourceId';
      const expectedAnalytics = {
        /* mocked analytics data */
      };

      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics)
        .calledWith(
          expect.objectContaining({
            model: predictionModel,
            filters: { newsSourceId },
            options: {
              startDate,
              endDate,
              frequency,
            },
          }),
        )
        .mockResolvedValue(expectedAnalytics as never);

      // When
      const result = await service.getBiasAnalytics(startDate, endDate, frequency, newsSourceId);

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          model: predictionModel,
          filters: { newsSourceId },
          options: {
            startDate,
            endDate,
            frequency,
          },
        }),
      );
      expect(result).toEqual(expectedAnalytics);
    });

    it('should return bias analytics without newsSourceId', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const expectedAnalytics = {
        /* mocked analytics data */
      };

      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics)
        .calledWith(
          expect.objectContaining({
            filters: { newsSourceId: undefined },
          }),
        )
        .mockResolvedValue(expectedAnalytics as never);

      // When
      const result = await service.getBiasAnalytics(startDate, endDate, frequency);

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalled();
      expect(result).toEqual(expectedAnalytics);
    });

    it('should throw an error if coreService throws an error', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'sourceId';
      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics).mockRejectedValue(
        new Error('Error fetching bias analytics') as never,
      );

      // When
      let error: Error | undefined;
      try {
        await service.getBiasAnalytics(startDate, endDate, frequency, newsSourceId);
      } catch (e) {
        error = e;
      }

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Error fetching bias analytics');
    });
  });

  describe('getTextAnalytics', () => {
    it('should return text analytics when all parameters are valid', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'sourceId';
      const expectedAnalytics = {
        /* mocked analytics data */
      };

      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics)
        .calledWith(
          expect.objectContaining({
            model: predictionModel,
            filters: { newsSourceId },
            options: {
              startDate,
              endDate,
              frequency,
            },
          }),
        )
        .mockResolvedValue(expectedAnalytics as never);

      // When
      const result = await service.getTextAnalytics(startDate, endDate, frequency, newsSourceId);

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          model: predictionModel,
          filters: { newsSourceId },
          options: {
            startDate,
            endDate,
            frequency,
          },
        }),
      );
      expect(result).toEqual(expectedAnalytics);
    });

    it('should return text analytics without newsSourceId', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const expectedAnalytics = {
        /* mocked analytics data */
      };

      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics)
        .calledWith(
          expect.objectContaining({
            filters: { newsSourceId: undefined },
          }),
        )
        .mockResolvedValue(expectedAnalytics as never);

      // When
      const result = await service.getTextAnalytics(startDate, endDate, frequency);

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalled();
      expect(result).toEqual(expectedAnalytics);
    });

    it('should throw an error if coreService throws an error', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'sourceId';
      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics).mockRejectedValue(
        new Error('Error fetching text analytics') as never,
      );

      // When
      let error: Error | undefined;
      try {
        await service.getTextAnalytics(startDate, endDate, frequency, newsSourceId);
      } catch (e) {
        error = e;
      }

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Error fetching text analytics');
    });
  });

  describe('getSarcAnalytics', () => {
    it('should return sarcasm analytics when all parameters are valid', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'sourceId';
      const expectedAnalytics = {
        /* mocked analytics data */
      };

      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics)
        .calledWith(
          expect.objectContaining({
            model: predictionModel,
            filters: { newsSourceId },
            options: {
              startDate,
              endDate,
              frequency,
            },
          }),
        )
        .mockResolvedValue(expectedAnalytics as never);

      // When
      const result = await service.getSarcAnalytics(startDate, endDate, frequency, newsSourceId);

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          model: predictionModel,
          filters: { newsSourceId },
          options: {
            startDate,
            endDate,
            frequency,
          },
        }),
      );
      expect(result).toEqual(expectedAnalytics);
    });

    it('should return sarcasm analytics without newsSourceId', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const expectedAnalytics = {
        /* mocked analytics data */
      };

      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics)
        .calledWith(
          expect.objectContaining({
            filters: { newsSourceId: undefined },
          }),
        )
        .mockResolvedValue(expectedAnalytics as never);

      // When
      const result = await service.getSarcAnalytics(startDate, endDate, frequency);

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalled();
      expect(result).toEqual(expectedAnalytics);
    });

    it('should throw an error if coreService throws an error', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'sourceId';
      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics).mockRejectedValue(
        new Error('Error fetching sarcasm analytics') as never,
      );

      // When
      let error: Error | undefined;
      try {
        await service.getSarcAnalytics(startDate, endDate, frequency, newsSourceId);
      } catch (e) {
        error = e;
      }

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Error fetching sarcasm analytics');
    });
  });

  describe('getFinalAnalytics', () => {
    it('should return final analytics when all parameters are valid', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'sourceId';
      const expectedAnalytics = {
        /* mocked analytics data */
      };

      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics)
        .calledWith(
          expect.objectContaining({
            model: predictionModel,
            filters: { newsSourceId },
            options: {
              startDate,
              endDate,
              frequency,
            },
          }),
        )
        .mockResolvedValue(expectedAnalytics as never);

      // When
      const result = await service.getFinalAnalytics(startDate, endDate, frequency, newsSourceId);

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          model: predictionModel,
          filters: { newsSourceId },
          options: {
            startDate,
            endDate,
            frequency,
          },
        }),
      );
      expect(result).toEqual(expectedAnalytics);
    });

    it('should return final analytics without newsSourceId', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const expectedAnalytics = {
        /* mocked analytics data */
      };

      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics)
        .calledWith(
          expect.objectContaining({
            filters: { newsSourceId: undefined },
          }),
        )
        .mockResolvedValue(expectedAnalytics as never);

      // When
      const result = await service.getFinalAnalytics(startDate, endDate, frequency);

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalled();
      expect(result).toEqual(expectedAnalytics);
    });

    it('should throw an error if coreService throws an error', async () => {
      // Given
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2023-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'sourceId';
      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');

      when(coreService_getOptimizedTimeBasedAnalytics).mockRejectedValue(
        new Error('Error fetching final analytics') as never,
      );

      // When
      let error: Error | undefined;
      try {
        await service.getFinalAnalytics(startDate, endDate, frequency, newsSourceId);
      } catch (e) {
        error = e;
      }

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Error fetching final analytics');
    });
  });
});
