import { faker } from '@faker-js/faker';
import { BadRequestException, HttpException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { when } from 'jest-when';
import { FeedbackDetails } from 'src/common/dtos/feedback-details.dto';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { Frequency } from 'src/common/enums/frequency.enum';
import { Reaction } from 'src/common/enums/reaction.enum';
import { MockUtils } from 'src/common/utils/mock.utils';
import { CoreService } from 'src/core/core.service';
import { PredictionService } from 'src/prediction/prediction.service';
import { Feedback, FeedbackDocument, FeedbackModel } from './feedback.schema';
import { FeedbackService } from './feedback.service';

describe('Feedback Test suite', () => {
  let service: FeedbackService;
  let coreService: CoreService;
  let predictionService: PredictionService;
  let feedbackModel: FeedbackModel;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: CoreService,
          useValue: {
            getDocumentPage: jest.fn(),
            getOptimizedTimeBasedAnalytics: jest.fn(),
          },
        },
        {
          provide: PredictionService,
          useValue: {
            getPrediction: jest.fn(),
          },
        },
        { provide: getModelToken(Feedback.name), useValue: MockUtils.mockModel({}) },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    coreService = module.get<CoreService>(CoreService);
    predictionService = module.get<PredictionService>(PredictionService);
    feedbackModel = module.get<FeedbackModel>(getModelToken(Feedback.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFeedback', () => {
    it('should return feedback when found', async () => {
      // Given
      const feedbackId = 'someFeedbackId';
      const feedbackData = { id: feedbackId, content: 'Great job!' };
      const feedbackModel_findById = jest.spyOn(feedbackModel, 'findById');

      when(feedbackModel_findById)
        .expectCalledWith(feedbackId)
        .mockResolvedValue(feedbackData as never); // Mock feedback data

      // When
      const result = await service.getFeedback(feedbackId);

      // Then
      expect(result).toEqual(feedbackData);
      expect(feedbackModel_findById).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when feedback is not found', async () => {
      // Given
      const feedbackId = 'nonExistentId';
      const feedbackModel_findById = jest.spyOn(feedbackModel, 'findById');

      when(feedbackModel_findById)
        .expectCalledWith(feedbackId)
        .mockResolvedValue(null as never); // Simulate feedback not found

      // When & Then
      await expect(service.getFeedback(feedbackId)).rejects.toThrow(BadRequestException);
      expect(feedbackModel_findById).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException with correct message when id is invalid', async () => {
      // Given
      const invalidId = 'invalidIdFormat';
      const feedbackModel_findById = jest.spyOn(feedbackModel, 'findById');

      when(feedbackModel_findById)
        .expectCalledWith(invalidId)
        .mockResolvedValue(null as never); // Simulate feedback not found

      // When & Then
      let error: HttpException | undefined = undefined;
      try {
        await service.getFeedback(invalidId);
      } catch (e) {
        error = e;
      }

      expect(feedbackModel_findById).toHaveBeenCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.FEEDBACK_NOT_FOUND);
    });
  });

  describe('getFeedbackDetails', () => {
    it('should return feedback and prediction when both are found', async () => {
      // Given
      const feedbackId = faker.database.mongodbObjectId();
      const expectedFeedback = { id: feedbackId, predictionId: 'predictionId' };
      const expectedPrediction = { id: 'predictionId', result: 'Predicted result' };

      const feedbackModel_findById = jest.spyOn(feedbackModel, 'findById');
      when(feedbackModel_findById)
        .expectCalledWith(feedbackId)
        .mockResolvedValue(expectedFeedback as never); // Mock found feedback

      const predictionService_getPrediction = jest.spyOn(predictionService, 'getPrediction');
      when(predictionService_getPrediction)
        .expectCalledWith(expectedFeedback.predictionId)
        .mockResolvedValue(expectedPrediction as never); // Mock found prediction

      // When
      const result = await service.getFeedbackDetails(feedbackId);

      // Then
      expect(result).toEqual([expectedFeedback, expectedPrediction]);
      expect(feedbackModel_findById).toHaveBeenCalledTimes(1);
      expect(predictionService.getPrediction).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when feedback is not found', async () => {
      // Given
      const feedbackId = 'invalidIdFormat';
      const feedbackModel_findById = jest.spyOn(feedbackModel, 'findById');

      when(feedbackModel_findById)
        .expectCalledWith(feedbackId)
        .mockResolvedValue(null as never); // Simulate feedback not found

      // When & Then
      let error: HttpException | undefined = undefined;
      try {
        await service.getFeedbackDetails(feedbackId);
      } catch (e) {
        error = e;
      }

      expect(feedbackModel_findById).toHaveBeenCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.FEEDBACK_NOT_FOUND);
    });
  });

  describe('getByCreatedBy', () => {
    it('should return feedback created by the specified user', async () => {
      // Given
      const createdBy = 'userId123';
      const expectedFeedback = [{ id: faker.database.mongodbObjectId(), createdBy }];
      const feedbackModel_find = jest.spyOn(feedbackModel, 'find');

      when(feedbackModel_find)
        .expectCalledWith({ createdBy } as any)
        .mockResolvedValue(expectedFeedback); // Mock found feedback

      // When
      const result = await service.getByCreatedBy(createdBy);

      // Then
      expect(result).toEqual(expectedFeedback);
      expect(feedbackModel_find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFeedbackByPredictionId', () => {
    it('should return feedback associated with the given predictionId', async () => {
      // Given
      const predictionId = 'predictionId';
      const expectedFeedback = [{ id: faker.database.mongodbObjectId(), predictionId }];
      const feedbackModel_find = jest.spyOn(feedbackModel, 'find');

      when(feedbackModel_find)
        .expectCalledWith({ predictionId } as any)
        .mockResolvedValue(expectedFeedback); // Mock found feedback

      // When
      const result = await service.getFeedbackByPredictionId(predictionId);

      // Then
      expect(result).toEqual(expectedFeedback);
      expect(feedbackModel_find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFeedbackByPredictionIds', () => {
    it('should return feedback associated with the given predictionIds', async () => {
      // Given
      const predictionIds = ['predictionId1', 'predictionId2'];
      const expectedFeedback = [{ id: faker.database.mongodbObjectId(), predictionId: 'predictionId1' }];
      const feedbackModel_find = jest.spyOn(feedbackModel, 'find');

      when(feedbackModel_find)
        .expectCalledWith({ predictionId: { $in: predictionIds } } as any)
        .mockResolvedValue(expectedFeedback); // Mock found feedback

      // When
      const result = await service.getFeedbackByPredictionIds(predictionIds);

      // Then
      expect(result).toEqual(expectedFeedback);
      expect(feedbackModel_find).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteFeedback', () => {
    it('should delete feedback when found', async () => {
      // Given
      const feedbackId = faker.database.mongodbObjectId();
      const feedbackModel_findByIdAndDelete = jest.spyOn(feedbackModel, 'findByIdAndDelete');

      when(feedbackModel_findByIdAndDelete)
        .expectCalledWith(feedbackId)
        .mockResolvedValue({ id: feedbackId } as never); // Mock found feedback

      // When
      await service.deleteFeedback(feedbackId);

      // Then
      expect(feedbackModel_findByIdAndDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when feedback is not found', async () => {
      // Given
      const feedbackId = 'invalidIdFormat';
      const feedbackModel_findByIdAndDelete = jest.spyOn(feedbackModel, 'findByIdAndDelete');

      when(feedbackModel_findByIdAndDelete)
        .expectCalledWith(feedbackId)
        .mockResolvedValue(null as never); // Simulate feedback not found

      // When & Then
      let error: HttpException | undefined = undefined;
      try {
        await service.deleteFeedback(feedbackId);
      } catch (e) {
        error = e;
      }

      expect(feedbackModel_findByIdAndDelete).toHaveBeenCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.FEEDBACK_NOT_FOUND);
    });
  });

  describe('deleteFeedbackByPredictionId', () => {
    it('should delete feedback by prediction ID', async () => {
      // Given
      const predictionId = 'predictionId';
      const feedbackModel_deleteMany = jest.spyOn(feedbackModel, 'deleteMany');

      when(feedbackModel_deleteMany)
        .expectCalledWith({ predictionId })
        .mockResolvedValue({ deletedCount: 3 } as never); // Mock deletion result

      // When
      await service.deleteFeedbackByPredictionId(predictionId);

      // Then
      expect(feedbackModel_deleteMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('createFeedback', () => {
    it('should create new feedback when it does not already exist', async () => {
      // Given
      const feedbackDetails: FeedbackDetails = { message: 'Great work!' };
      const reaction: Reaction = 'GOOD';

      const predictionId = faker.database.mongodbObjectId();
      const userId = faker.database.mongodbObjectId();
      const feedbackModel_findOne = jest.spyOn(feedbackModel, 'findOne');
      const predictionService_getPrediction = jest.spyOn(predictionService, 'getPrediction');
      const feedbackModel_create = jest.spyOn(feedbackModel, 'create');

      const newFeedback = {
        createdAt: new Date(),
        createdBy: userId,
        details: feedbackDetails,
        reaction,
        predictionId,
      };

      when(predictionService_getPrediction)
        .expectCalledWith(predictionId)
        .mockResolvedValue({ id: predictionId } as any); // Mock prediction data
      when(feedbackModel_findOne)
        .expectCalledWith({ predictionId, createdBy: userId })
        .mockResolvedValue(null as never); // Simulate feedback not found
      when(feedbackModel_create).mockResolvedValue(newFeedback as any); // Mock saving feedback

      // When
      await service.createFeedback(feedbackDetails, reaction, predictionId, userId);

      // Then
      expect(predictionService_getPrediction).toHaveBeenCalledTimes(1);
      expect(feedbackModel_findOne).toHaveBeenCalledTimes(1);
      expect(feedbackModel_create).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when feedback already exists', async () => {
      // Given
      const feedbackDetails: FeedbackDetails = { message: 'Great work!' };
      const reaction: Reaction = 'GOOD';
      const predictionId = faker.database.mongodbObjectId();
      const userId = faker.database.mongodbObjectId();
      const existingFeedback = { id: faker.database.mongodbObjectId(), createdBy: userId };
      const feedbackModel_findOne = jest.spyOn(feedbackModel, 'findOne');

      when(feedbackModel_findOne)
        .expectCalledWith({ predictionId, createdBy: userId })
        .mockResolvedValue(existingFeedback as never); // Simulate feedback already exists

      // When & Then
      let error: HttpException | undefined = undefined;
      try {
        await service.createFeedback(feedbackDetails, reaction, predictionId, userId);
      } catch (e) {
        error = e;
      }

      expect(feedbackModel_findOne).toHaveBeenCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.FEEDBACK_ALREADY_EXISTS);
    });
  });

  describe('updateFeedback', () => {
    it('should update feedback when it belongs to the user', async () => {
      // Given
      const feedbackId = faker.database.mongodbObjectId();
      const reaction: Reaction = 'GOOD';

      const feedbackDetails: FeedbackDetails = { message: 'Updated feedback!' };
      const userId = faker.database.mongodbObjectId();
      const existingFeedback: Partial<FeedbackDocument> = {
        id: feedbackId,
        createdBy: userId,
        reaction: 'BAD',
        details: { message: 'Old feedback!' },
        save: jest.fn().mockResolvedValue({ reaction, details: feedbackDetails }),
      };

      const feedbackModel_getFeedback = jest.spyOn(service, 'getFeedback');
      when(feedbackModel_getFeedback)
        .expectCalledWith(feedbackId)
        .mockResolvedValue(existingFeedback as any); // Mock existing feedback

      // When
      await service.updateFeedback(feedbackId, reaction, feedbackDetails, userId);

      // Then
      expect(feedbackModel_getFeedback).toHaveBeenCalledTimes(1);
      expect(existingFeedback.save).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException when feedback does not belong to the user', async () => {
      // Given
      const feedbackId = faker.database.mongodbObjectId();
      const reaction: Reaction = 'GOOD';

      const feedbackDetails: FeedbackDetails = { message: 'Updated feedback!' };
      const userId = faker.database.mongodbObjectId();
      const existingFeedback = {
        id: feedbackId,
        createdBy: faker.database.mongodbObjectId(), // Different user
        save: jest.fn(),
      };

      const feedbackModel_getFeedback = jest.spyOn(service, 'getFeedback');
      when(feedbackModel_getFeedback)
        .expectCalledWith(feedbackId)
        .mockResolvedValue(existingFeedback as any); // Mock existing feedback

      // When & Then
      let error: HttpException | undefined = undefined;
      try {
        await service.updateFeedback(feedbackId, reaction, feedbackDetails, userId);
      } catch (e) {
        error = e;
      }

      expect(feedbackModel_getFeedback).toHaveBeenCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.OWNERSHIP_NOT_VERIFIED);
    });
  });

  describe('getFeedbackPage', () => {
    it('should return a page of feedback', async () => {
      // Given
      const pageRequest: PageRequest = {
        pageNum: 1,
        pageSize: 10,
        sort: { direction: 'desc', field: 'createdAt' },
      };
      const coreService_getDocumentPage = jest.spyOn(coreService, 'getDocumentPage');
      const feedbackPage = {
        items: [],
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
      };

      when(coreService_getDocumentPage)
        .expectCalledWith(feedbackModel, pageRequest)
        .mockResolvedValue(feedbackPage as never); // Mock paginated feedback

      // When
      const result = await service.getFeedbackPage(pageRequest);

      // Then
      expect(coreService_getDocumentPage).toHaveBeenCalledTimes(1);
      expect(result).toEqual(feedbackPage);
    });

    it('should throw error when coreService.getDocumentPage fails', async () => {
      // Given
      const pageRequest: PageRequest = {
        pageNum: 1,
        pageSize: 10,
        sort: { direction: 'desc', field: 'createdAt' },
      };
      const coreService_getDocumentPage = jest.spyOn(coreService, 'getDocumentPage');
      const expectedError = new Error('Failed to fetch page');

      when(coreService_getDocumentPage).expectCalledWith(feedbackModel, pageRequest).mockRejectedValue(expectedError); // Simulate failure

      // When & Then
      let error: Error | undefined = undefined;
      try {
        await service.getFeedbackPage(pageRequest);
      } catch (e) {
        error = e;
      }

      expect(coreService_getDocumentPage).toHaveBeenCalledTimes(1);
      expect(error).toBe(expectedError);
    });
  });

  describe('getAnalytics', () => {
    it('should return time-based analytics for the given date range', async () => {
      // Given
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');
      const analyticsResult = {
        good: [{ date: new Date('2024-01-01'), count: 5 }],
        bad: [{ date: new Date('2024-01-01'), count: 2 }],
      };

      when(coreService_getOptimizedTimeBasedAnalytics)
        .expectCalledWith({
          model: feedbackModel,
          options: {
            startDate,
            endDate,
            frequency,
          },
          fields: {
            bad: { path: 'reaction', value: Reaction.BAD },
            good: { path: 'reaction', value: Reaction.GOOD },
          },
        })
        .mockResolvedValue(analyticsResult as any); // Mock analytics data

      // When
      const result = await service.getAnalytics(startDate, endDate, frequency);

      // Then
      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalledTimes(1);
      expect(result).toEqual(analyticsResult);
    });

    it('should throw error when coreService.getOptimizedTimeBasedAnalytics fails', async () => {
      // Given
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const frequency: Frequency = Frequency.DAILY;
      const coreService_getOptimizedTimeBasedAnalytics = jest.spyOn(coreService, 'getOptimizedTimeBasedAnalytics');
      const expectedError = new Error('Failed to fetch analytics');

      when(coreService_getOptimizedTimeBasedAnalytics)
        .expectCalledWith({
          model: feedbackModel,
          options: {
            startDate,
            endDate,
            frequency,
          },
          fields: {
            bad: { path: 'reaction', value: Reaction.BAD },
            good: { path: 'reaction', value: Reaction.GOOD },
          },
        })
        .mockRejectedValue(expectedError); // Simulate failure

      // When & Then
      let error: Error | undefined = undefined;
      try {
        await service.getAnalytics(startDate, endDate, frequency);
      } catch (e) {
        error = e;
      }

      expect(coreService_getOptimizedTimeBasedAnalytics).toHaveBeenCalledTimes(1);
      expect(error).toBe(expectedError);
    });
  });
});
