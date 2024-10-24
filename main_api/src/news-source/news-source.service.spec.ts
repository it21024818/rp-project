import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { when } from 'jest-when';
import { Model } from 'mongoose';
import { PageRequest } from 'src/common/dtos/page-request.dto';
import { UpdateNewsSourceRequestDto } from 'src/common/dtos/request/update-news-source.request.dto';
import { TimeBasedAnalytics } from 'src/common/dtos/time-based-analytics.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { Frequency } from 'src/common/enums/frequency.enum';
import { MockUtils } from 'src/common/utils/mock.utils';
import { CoreService } from 'src/core/core.service';
import { PredictionService } from 'src/prediction/prediction.service';
import { NewsSource, NewsSourceDocument } from './news-source.schema';
import { NewsSourceService } from './news-source.service';

describe('NewsSource Test suite', () => {
  let service: NewsSourceService;
  let coreService: CoreService;
  let predictionService: PredictionService;
  let newsSourceModel: Model<NewsSource>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NewsSourceService,
        {
          provide: CoreService,
          useValue: {
            getDocumentPage: jest.fn(),
          },
        },
        {
          provide: PredictionService,
          useValue: {
            getSentimentAnalytics: jest.fn(),
            getBiasAnalytics: jest.fn(),
            getTextAnalytics: jest.fn(),
            getSarcAnalytics: jest.fn(),
            getFinalAnalytics: jest.fn(),
          },
        },
        { provide: getModelToken(NewsSource.name), useValue: MockUtils.mockModel({}) },
      ],
    }).compile();

    service = module.get<NewsSourceService>(NewsSourceService);
    coreService = module.get<CoreService>(CoreService);
    predictionService = module.get<PredictionService>(PredictionService);
    newsSourceModel = module.get<Model<NewsSource>>(getModelToken(NewsSource.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNewsSourceByDomain', () => {
    it('should create a new news source if it does not already exist', async () => {
      const domain = 'example.com';
      const userId = 'userId123';
      const existingNewsSource = null; // Simulate that no news source exists
      const createdNewsSource = { domain, createdBy: userId, identifications: [domain] };

      const newsSourceModel_findOne = jest.spyOn(newsSourceModel, 'findOne');
      const newsSourceModel_create = jest.spyOn(newsSourceModel, 'create');

      when(newsSourceModel_findOne)
        .expectCalledWith({ identifications: { $in: [domain] } })
        .mockResolvedValue(existingNewsSource as never);
      when(newsSourceModel_create).mockResolvedValue(createdNewsSource as any);

      const result = await service.createNewsSourceByDomain(domain, userId);

      expect(result).toEqual(createdNewsSource);
      expect(newsSourceModel_findOne).toBeCalledTimes(1);
      expect(newsSourceModel_create).toBeCalledTimes(1);
    });

    it('should throw BadRequestException if news source already exists', async () => {
      const domain = 'example.com';
      const userId = 'userId123';
      const existingNewsSource = { domain }; // Simulate existing news source

      const newsSourceModel_findOne = jest.spyOn(newsSourceModel, 'findOne');

      when(newsSourceModel_findOne)
        .expectCalledWith({ identifications: { $in: [domain] } })
        .mockResolvedValue(existingNewsSource as never);

      await expect(service.createNewsSourceByDomain(domain, userId)).rejects.toThrow(BadRequestException);
      expect(newsSourceModel_findOne).toBeCalledTimes(1);
    });
  });

  describe('updateNewsSource', () => {
    it('should update the news source with the provided data', async () => {
      const id = 'newsSourceId123';
      const updateDto: UpdateNewsSourceRequestDto = {
        name: 'Updated Name',
        identifications: ['updated.example.com'],
        domain: 'updated.example.com',
      };
      const existingNewsSource = {
        name: 'Old Name',
        identifications: ['old.example.com'],
        domain: 'old.example.com',
        save: jest.fn().mockResolvedValue(true),
      };

      const getNewsSource = jest.spyOn(service, 'getNewsSource').mockResolvedValue(existingNewsSource as any);

      await service.updateNewsSource(id, updateDto);

      expect(existingNewsSource.name).toBe(updateDto.name);
      expect(existingNewsSource.identifications).toBe(updateDto.identifications);
      expect(existingNewsSource.domain).toBe(updateDto.domain);
      expect(existingNewsSource.save).toBeCalledTimes(1);
      expect(getNewsSource).toBeCalledWith(id);
    });
  });

  describe('getNewsSource', () => {
    it('should return the news source if found', async () => {
      const id = 'newsSourceId123';
      const foundNewsSource = { id, domain: 'example.com' };

      const newsSourceModel_findById = jest.spyOn(newsSourceModel, 'findById');

      when(newsSourceModel_findById)
        .expectCalledWith(id)
        .mockResolvedValue(foundNewsSource as never);

      const result = await service.getNewsSource(id);

      expect(result).toEqual(foundNewsSource);
      expect(newsSourceModel_findById).toBeCalledTimes(1);
    });

    it('should throw BadRequestException with correct message when id is invalid', async () => {
      // Given
      const invalidId = 'invalidIdFormat';
      const newsSourceModel_findById = jest.spyOn(newsSourceModel, 'findById');

      when(newsSourceModel_findById)
        .expectCalledWith(invalidId)
        .mockResolvedValue(null as never); // Simulate news source not found

      // When & Then
      let error: BadRequestException | undefined = undefined;
      try {
        await service.getNewsSource(invalidId);
      } catch (e) {
        error = e;
      }

      expect(newsSourceModel_findById).toHaveBeenCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.NEWS_SOURCE_NOT_FOUND);
    });
  });

  describe('getNewsSourceByIdentification', () => {
    it('should return the news source if found by identification', async () => {
      const domain = 'example.com';
      const foundNewsSource = { id: 'newsSourceId123', domain };

      const newsSourceModel_findOne = jest.spyOn(newsSourceModel, 'findOne');

      when(newsSourceModel_findOne)
        .expectCalledWith({ identifications: { $in: [domain] } })
        .mockResolvedValue(foundNewsSource as never);

      const result = await service.getNewsSourceByIdentification(domain);

      expect(result).toEqual(foundNewsSource);
      expect(newsSourceModel_findOne).toBeCalledTimes(1);
    });

    it('should throw BadRequestException with correct message when identification is not found', async () => {
      // Given
      const domain = 'example.com';
      const newsSourceModel_findOne = jest.spyOn(newsSourceModel, 'findOne');

      when(newsSourceModel_findOne)
        .expectCalledWith({ identifications: { $in: [domain] } })
        .mockResolvedValue(null as never); // Simulate news source not found

      // When & Then
      let error: BadRequestException | undefined = undefined;
      try {
        await service.getNewsSourceByIdentification(domain);
      } catch (e) {
        error = e;
      }

      expect(newsSourceModel_findOne).toHaveBeenCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.NEWS_SOURCE_NOT_FOUND);
    });
  });

  describe('getPredictionPage', () => {
    it('should return the prediction page', async () => {
      const pageRequest: PageRequest = {
        pageNum: 1,
        pageSize: 10,
      };
      const expectedResult = { data: [], total: 0 };

      const coreService_getDocumentPage = jest.spyOn(coreService, 'getDocumentPage');
      when(coreService_getDocumentPage)
        .expectCalledWith(expect.anything(), pageRequest)
        .mockResolvedValue(expectedResult as any);

      const result = await service.getPredictionPage(pageRequest);

      expect(result).toEqual(expectedResult);
      expect(coreService_getDocumentPage).toBeCalledTimes(1);
    });
  });

  describe('getSentimentAnalytics', () => {
    it('should return sentiment analytics', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'newsSourceId123';
      const analyticsResult: TimeBasedAnalytics<any> = { bins: [], sum: { total: 0 } };
      const newsSource = {
        domain: 'example.com',
        identifications: ['example.com'],
        name: 'Example',
      } as NewsSourceDocument;

      const newsSource_get = jest.spyOn(service, 'getNewsSource');
      const predictionService_getSentimentAnalytics = jest.spyOn(predictionService, 'getSentimentAnalytics');

      when(newsSource_get).expectCalledWith(newsSourceId).mockResolvedValue(newsSource);
      when(predictionService_getSentimentAnalytics)
        .expectCalledWith(startDate, endDate, frequency, newsSourceId)
        .mockResolvedValue(analyticsResult);

      const result = await service.getSentimentAnalytics(startDate, endDate, frequency, newsSourceId);

      expect(result).toEqual(analyticsResult);
      expect(newsSource_get).toBeCalledTimes(1);
      expect(predictionService_getSentimentAnalytics).toBeCalledTimes(1);
    });

    it('should throw BadRequestException if news source is not found', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'invalidNewsSourceId';
      const newsSource_get = jest.spyOn(service, 'getNewsSource');

      when(newsSource_get)
        .expectCalledWith(newsSourceId)
        .mockRejectedValue(new BadRequestException(ErrorMessage.NEWS_SOURCE_NOT_FOUND));

      let error: BadRequestException | undefined = undefined;
      try {
        await service.getSentimentAnalytics(startDate, endDate, frequency, newsSourceId);
      } catch (e) {
        error = e;
      }

      expect(newsSource_get).toBeCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.NEWS_SOURCE_NOT_FOUND);
    });
  });

  describe('getBiasAnalytics', () => {
    it('should return bias analytics', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'newsSourceId123';
      const analyticsResult: TimeBasedAnalytics<any> = { bins: [], sum: { total: 0 } };
      const newsSource = {
        domain: 'example.com',
        identifications: ['example.com'],
        name: 'Example',
      } as NewsSourceDocument;

      const newsSource_get = jest.spyOn(service, 'getNewsSource');

      when(newsSource_get).expectCalledWith(newsSourceId).mockResolvedValue(newsSource);
      when(predictionService.getBiasAnalytics)
        .expectCalledWith(startDate, endDate, frequency, newsSourceId)
        .mockResolvedValue(analyticsResult);

      const result = await service.getBiasAnalytics(startDate, endDate, frequency, newsSourceId);

      expect(result).toEqual(analyticsResult);
      expect(newsSource_get).toBeCalledTimes(1);
      expect(predictionService.getBiasAnalytics).toBeCalledTimes(1);
    });

    it('should throw BadRequestException if news source is not found', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'invalidNewsSourceId';
      const newsSource_get = jest.spyOn(service, 'getNewsSource');

      when(newsSource_get)
        .expectCalledWith(newsSourceId)
        .mockRejectedValue(new BadRequestException(ErrorMessage.NEWS_SOURCE_NOT_FOUND));

      let error: BadRequestException | undefined = undefined;
      try {
        await service.getBiasAnalytics(startDate, endDate, frequency, newsSourceId);
      } catch (e) {
        error = e;
      }

      expect(newsSource_get).toBeCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.NEWS_SOURCE_NOT_FOUND);
    });
  });

  describe('getTextAnalytics', () => {
    it('should return text analytics', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'newsSourceId123';
      const analyticsResult: TimeBasedAnalytics<any> = { bins: [], sum: { total: 0 } };
      const newsSource = {
        domain: 'example.com',
        identifications: ['example.com'],
        name: 'Example',
      } as NewsSourceDocument;

      const newsSource_get = jest.spyOn(service, 'getNewsSource');

      when(newsSource_get).expectCalledWith(newsSourceId).mockResolvedValue(newsSource);
      when(predictionService.getTextAnalytics)
        .expectCalledWith(startDate, endDate, frequency, newsSourceId)
        .mockResolvedValue(analyticsResult);

      const result = await service.getTextAnalytics(startDate, endDate, frequency, newsSourceId);

      expect(result).toEqual(analyticsResult);
      expect(newsSource_get).toBeCalledTimes(1);
      expect(predictionService.getTextAnalytics).toBeCalledTimes(1);
    });

    it('should throw BadRequestException if news source is not found', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'invalidNewsSourceId';
      const newsSource_get = jest.spyOn(service, 'getNewsSource');

      when(newsSource_get)
        .expectCalledWith(newsSourceId)
        .mockRejectedValue(new BadRequestException(ErrorMessage.NEWS_SOURCE_NOT_FOUND));

      let error: BadRequestException | undefined = undefined;
      try {
        await service.getTextAnalytics(startDate, endDate, frequency, newsSourceId);
      } catch (e) {
        error = e;
      }

      expect(newsSource_get).toBeCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.NEWS_SOURCE_NOT_FOUND);
    });
  });

  describe('getSarcAnalytics', () => {
    it('should return sarcasm analytics', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'newsSourceId123';
      const analyticsResult: TimeBasedAnalytics<any> = { bins: [], sum: { total: 0 } };
      const newsSource = {
        domain: 'example.com',
        identifications: ['example.com'],
        name: 'Example',
      } as NewsSourceDocument;

      const newsSource_get = jest.spyOn(service, 'getNewsSource');

      when(newsSource_get).expectCalledWith(newsSourceId).mockResolvedValue(newsSource);
      when(predictionService.getSarcAnalytics)
        .expectCalledWith(startDate, endDate, frequency, newsSourceId)
        .mockResolvedValue(analyticsResult);

      const result = await service.getSarcAnalytics(startDate, endDate, frequency, newsSourceId);

      expect(result).toEqual(analyticsResult);
      expect(newsSource_get).toBeCalledTimes(1);
      expect(predictionService.getSarcAnalytics).toBeCalledTimes(1);
    });

    it('should throw BadRequestException if news source is not found', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'invalidNewsSourceId';
      const newsSource_get = jest.spyOn(service, 'getNewsSource');

      when(newsSource_get)
        .expectCalledWith(newsSourceId)
        .mockRejectedValue(new BadRequestException(ErrorMessage.NEWS_SOURCE_NOT_FOUND));

      let error: BadRequestException | undefined = undefined;
      try {
        await service.getSarcAnalytics(startDate, endDate, frequency, newsSourceId);
      } catch (e) {
        error = e;
      }

      expect(newsSource_get).toBeCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.NEWS_SOURCE_NOT_FOUND);
    });
  });

  describe('getFinalAnalytics', () => {
    it('should return final analytics', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'newsSourceId123';
      const analyticsResult: TimeBasedAnalytics<any> = { bins: [], sum: { total: 0 } };
      const newsSource = {
        domain: 'example.com',
        identifications: ['example.com'],
        name: 'Example',
      } as NewsSourceDocument;

      const newsSource_get = jest.spyOn(service, 'getNewsSource');
      const predictionService_getFinalAnalytics = jest.spyOn(service, 'getFinalAnalytics');

      when(newsSource_get).expectCalledWith(newsSourceId).mockResolvedValue(newsSource);
      when(predictionService_getFinalAnalytics)
        .expectCalledWith(startDate, endDate, frequency, newsSourceId)
        .mockResolvedValue(analyticsResult);

      const result = await service.getFinalAnalytics(startDate, endDate, frequency, newsSourceId);

      expect(result).toEqual(analyticsResult);
      expect(predictionService_getFinalAnalytics).toBeCalledTimes(1);
    });

    it('should throw BadRequestException if news source is not found', async () => {
      const startDate = new Date();
      const endDate = new Date();
      const frequency: Frequency = Frequency.DAILY;
      const newsSourceId = 'invalidNewsSourceId';
      const newsSource_get = jest.spyOn(service, 'getNewsSource');

      when(newsSource_get)
        .expectCalledWith(newsSourceId)
        .mockRejectedValue(new BadRequestException(ErrorMessage.NEWS_SOURCE_NOT_FOUND));

      let error: BadRequestException | undefined = undefined;
      try {
        await service.getFinalAnalytics(startDate, endDate, frequency, newsSourceId);
      } catch (e) {
        error = e;
      }

      expect(newsSource_get).toBeCalledTimes(1);
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error?.message).toBe(ErrorMessage.NEWS_SOURCE_NOT_FOUND);
    });
  });
});
