import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { PageMetadata } from 'src/common/dtos/page-metadata.dto';
import { CriteriaOperator, SortItem } from 'src/common/dtos/page-request.dto';
import { Frequency } from 'src/common/enums/frequency.enum';
import { MockUtils } from 'src/common/utils/mock.utils';
import { CoreService } from 'src/core/core.service';

describe('CoreService', () => {
  let service: CoreService;
  let modelMock: Model<any>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CoreService,
        {
          provide: getModelToken('ModelName'), // Adjust with the correct model name
          useValue: MockUtils.mockModel([]), // You can pass an initial value if needed
        },
      ],
    }).compile();

    service = module.get<CoreService>(CoreService);
    modelMock = module.get<Model<any>>(getModelToken('ModelName'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOptimizedTimeBasedAnalytics', () => {
    it('should return analytics data for DAILY frequency', async () => {
      const params = {
        model: modelMock,
        options: {
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-31'),
          frequency: Frequency.DAILY,
        },
        fields: {
          someField: { path: 'someField', value: 'someValue' },
        },
        filters: {},
      };

      const mockAnalyticsData = {
        sum: { total: 10, someField: 5 },
        bins: [
          { startDate: '2023-01-01', endDate: '2023-01-01', someField: 1 },
          { startDate: '2023-01-02', endDate: '2023-01-02', someField: 2 },
        ],
      };

      const aggregateSpy = jest.spyOn(modelMock, 'aggregate').mockResolvedValueOnce([mockAnalyticsData]);

      const result = await service.getOptimizedTimeBasedAnalytics(params);

      expect(result).toEqual(mockAnalyticsData);
      expect(aggregateSpy).toHaveBeenCalledTimes(1);
    });

    it('should return empty analytics for DAILY frequency when no data is found', async () => {
      const params = {
        model: modelMock,
        options: {
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-02'),
          frequency: Frequency.DAILY,
        },
        fields: {
          someField: { path: 'someField', value: 'someValue' },
        },
        filters: {},
      };

      jest.spyOn(modelMock, 'aggregate').mockResolvedValueOnce([]);

      const result = await service.getOptimizedTimeBasedAnalytics(params);

      expect(result).toEqual({
        sum: { total: 0, someField: 0 },
        bins: [
          {
            endDate: '2023-01-01',
            someField: 0,
            startDate: '2023-01-01',
          },
          {
            endDate: '2023-01-02',
            someField: 0,
            startDate: '2023-01-02',
          },
        ],
      });
    });

    it('should return analytics data for WEEKLY frequency', async () => {
      const params = {
        model: modelMock,
        options: {
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-31'),
          frequency: Frequency.WEEKLY,
        },
        fields: {
          someField: { path: 'someField', value: 'someValue' },
        },
        filters: {},
      };

      const mockAnalyticsData = {
        sum: { total: 20, someField: 10 },
        bins: [
          { startDate: '2023-01-01', endDate: '2023-01-07', someField: 5 },
          { startDate: '2023-01-08', endDate: '2023-01-14', someField: 6 },
        ],
      };

      const aggregateSpy = jest.spyOn(modelMock, 'aggregate').mockResolvedValueOnce([mockAnalyticsData]);

      const result = await service.getOptimizedTimeBasedAnalytics(params);

      expect(result).toEqual(mockAnalyticsData);
      expect(aggregateSpy).toHaveBeenCalledTimes(1);
    });

    it('should return empty analytics for WEEKLY frequency when no data is found', async () => {
      const params = {
        model: modelMock,
        options: {
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-15'),
          frequency: Frequency.WEEKLY,
        },
        fields: {
          someField: { path: 'someField', value: 'someValue' },
        },
        filters: {},
      };

      jest.spyOn(modelMock, 'aggregate').mockResolvedValueOnce([]);

      const result = await service.getOptimizedTimeBasedAnalytics(params);

      expect(result).toEqual({
        sum: { total: 0, someField: 0 },
        bins: [
          {
            endDate: '2022-12-26',
            someField: 0,
            startDate: '2022-12-26',
          },
          {
            endDate: '2023-01-02',
            someField: 0,
            startDate: '2023-01-02',
          },
          {
            endDate: '2023-01-09',
            someField: 0,
            startDate: '2023-01-09',
          },
        ],
      });
    });

    it('should return analytics data for MONTHLY frequency', async () => {
      const params = {
        model: modelMock,
        options: {
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-31'),
          frequency: Frequency.MONTHLY,
        },
        fields: {
          someField: { path: 'someField', value: 'someValue' },
        },
        filters: {},
      };

      const mockAnalyticsData = {
        sum: { total: 30, someField: 15 },
        bins: [{ startDate: '2023-01-01', endDate: '2023-01-31', someField: 15 }],
      };

      const aggregateSpy = jest.spyOn(modelMock, 'aggregate').mockResolvedValueOnce([mockAnalyticsData]);

      const result = await service.getOptimizedTimeBasedAnalytics(params);

      expect(result).toEqual(mockAnalyticsData);
      expect(aggregateSpy).toHaveBeenCalledTimes(1);
    });

    it('should return empty analytics for MONTHLY frequency when no data is found', async () => {
      const params = {
        model: modelMock,
        options: {
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-31'),
          frequency: Frequency.MONTHLY,
        },
        fields: {
          someField: { path: 'someField', value: 'someValue' },
        },
        filters: {},
      };

      jest.spyOn(modelMock, 'aggregate').mockResolvedValueOnce([]);

      const result = await service.getOptimizedTimeBasedAnalytics(params);

      expect(result).toEqual({
        sum: { total: 0, someField: 0 },
        bins: [
          {
            endDate: '2023-01-01',
            someField: 0,
            startDate: '2023-01-01',
          },
        ],
      });
    });

    it('should return analytics data for YEARLY frequency', async () => {
      const params = {
        model: modelMock,
        options: {
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-12-31'),
          frequency: Frequency.YEARLY,
        },
        fields: {
          someField: { path: 'someField', value: 'someValue' },
        },
        filters: {},
      };

      const mockAnalyticsData = {
        sum: { total: 100, someField: 50 },
        bins: [{ startDate: '2023-01-01', endDate: '2023-12-31', someField: 50 }],
      };

      const aggregateSpy = jest.spyOn(modelMock, 'aggregate').mockResolvedValueOnce([mockAnalyticsData]);

      const result = await service.getOptimizedTimeBasedAnalytics(params);

      expect(result).toEqual(mockAnalyticsData);
      expect(aggregateSpy).toHaveBeenCalledTimes(1);
    });

    it('should return empty analytics for YEARLY frequency when no data is found', async () => {
      const params = {
        model: modelMock,
        options: {
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-12-31'),
          frequency: Frequency.YEARLY,
        },
        fields: {
          someField: { path: 'someField', value: 'someValue' },
        },
        filters: {},
      };

      jest.spyOn(modelMock, 'aggregate').mockResolvedValueOnce([]);

      const result = await service.getOptimizedTimeBasedAnalytics(params);

      expect(result).toEqual({
        sum: { total: 0, someField: 0 },
        bins: [
          {
            endDate: '2023-01-01',
            someField: 0,
            startDate: '2023-01-01',
          },
        ],
      });
    });
  });

  describe('buildSort', () => {
    it('should return an array with the sort field and order', () => {
      const sort: SortItem = { direction: 'asc', field: 'name' };
      const result = service.buildSort(sort);
      expect(result).toEqual([['name', 'asc']]);
    });

    it('should return an empty array if no sort field is provided', () => {
      const result = service.buildSort(undefined);
      expect(result).toEqual([[]]);
    });
  });

  describe('buildQueryFromFilter', () => {});

  describe('buildPage', () => {
    it('should return a paginated result with correct metadata', () => {
      const content = [{ name: 'John' }, { name: 'Jane' }];
      const metadata: PageMetadata = {
        totalDocuments: 100,
        pageSize: 10,
        pageNum: 1,
        isFirst: true,
        isLast: false,
        totalPages: 10,
      };

      const result = service.buildPage(content, metadata);
      expect(result).toEqual({
        content,
        metadata: {
          ...metadata,
          isFirst: true,
          isLast: false,
          totalPages: 10,
        },
      });
    });

    it('should correctly identify the first and last page', () => {
      const content = [{ name: 'John' }];
      const metadataFirstPage: PageMetadata = {
        totalDocuments: 50,
        pageSize: 10,
        pageNum: 1,
        totalPages: 5,
        isFirst: true,
        isLast: false,
      };
      const metadataLastPage = {
        totalDocuments: 50,
        pageSize: 10,
        pageNum: 5,
        totalPages: 5,
        isFirst: false,
        isLast: true,
      };

      const resultFirstPage = service.buildPage(content, metadataFirstPage);
      const resultLastPage = service.buildPage(content, metadataLastPage);

      expect(resultFirstPage.metadata.isFirst).toBe(true);
      expect(resultFirstPage.metadata.isLast).toBe(false);
      expect(resultLastPage.metadata.isFirst).toBe(false);
      expect(resultLastPage.metadata.isLast).toBe(true);
    });

    it('should return the correct total number of pages', () => {
      const content = [{ name: 'John' }];
      const metadata: PageMetadata = {
        totalDocuments: 27,
        pageSize: 10,
        pageNum: 1,
        isFirst: true,
        isLast: false,
        totalPages: 3,
      };

      const result = service.buildPage(content, metadata);
      expect(result.metadata.totalPages).toBe(3);
    });
  });

  describe('buildQueryFromFilter', () => {
    it('should build a query from filter with valid operators and values', () => {
      const filter = {
        age: { operator: CriteriaOperator.GREATER_THAN, value: 18 },
        name: { operator: CriteriaOperator.EQUALS, value: 'John' },
      };

      const mockQuery = {
        age: { $gt: 18 },
        name: { $eq: 'John' },
      };

      const result = service.buildQueryFromFilter(filter);
      expect(result).toEqual(mockQuery);
    });

    it('should throw an error if operator or value is missing', () => {
      const filter = {
        age: { operator: CriteriaOperator.GREATER_THAN, value: null },
      };

      expect(() => service.buildQueryFromFilter(filter)).toThrow(BadRequestException);
    });

    it('should handle empty filter', () => {
      const result = service.buildQueryFromFilter(undefined);
      expect(result).toEqual({});
    });

    it('should throw an error for invalid operators', () => {
      const filter = {
        age: { operator: 'invalid_operator' as any, value: 18 },
      };

      expect(() => service.buildQueryFromFilter(filter)).toThrow(BadRequestException);
    });
  });

  describe('buildInQuery', () => {
    it('should return a query with $in operator when value is an array', () => {
      const result = service['buildInQuery']('roles', ['admin', 'user']);
      expect(result).toEqual({ roles: { $in: ['admin', 'user'] } });
    });

    it('should wrap value in an array if value is not an array', () => {
      const result = service['buildInQuery']('roles', 'admin');
      expect(result).toEqual({ roles: { $in: ['admin'] } });
    });

    it('should return null if value is undefined', () => {
      const result = service['buildInQuery']('roles', undefined);
      expect(result).toBeNull();
    });
  });

  describe('buildNotInQuery', () => {
    it('should return a query with $nin operator when value is an array', () => {
      const result = service['buildNotInQuery']('countries', ['USA', 'Canada']);
      expect(result).toEqual({ countries: { $nin: ['USA', 'Canada'] } });
    });

    it('should wrap value in an array if value is not an array', () => {
      const result = service['buildNotInQuery']('countries', 'USA');
      expect(result).toEqual({ countries: { $nin: ['USA'] } });
    });

    it('should return null if value is undefined', () => {
      const result = service['buildNotInQuery']('countries', undefined);
      expect(result).toBeNull();
    });
  });

  describe('buildEqualsQuery', () => {
    it('should return a query with $eq operator when value is provided', () => {
      const result = service['buildEqualsQuery']('status', 'active');
      expect(result).toEqual({ status: { $eq: 'active' } });
    });

    it('should return null if value is undefined', () => {
      const result = service['buildEqualsQuery']('status', undefined);
      expect(result).toBeNull();
    });
  });

  describe('buildNotEqualsQuery', () => {
    it('should return a query with $ne operator when value is provided', () => {
      const result = service['buildNotEqualsQuery']('status', 'inactive');
      expect(result).toEqual({ status: { $ne: 'inactive' } });
    });

    it('should return null if value is undefined', () => {
      const result = service['buildNotEqualsQuery']('status', undefined);
      expect(result).toBeNull();
    });
  });

  describe('buildGreaterThanQuery', () => {
    it('should return a query with $gt operator when value is provided', () => {
      const result = service['buildGreaterThanQuery']('age', 18);
      expect(result).toEqual({ age: { $gt: 18 } });
    });

    it('should return null if value is undefined', () => {
      const result = service['buildGreaterThanQuery']('age', undefined);
      expect(result).toBeNull();
    });
  });

  describe('buildLessThanQuery', () => {
    it('should return a query with $lt operator when value is provided', () => {
      const result = service['buildLessThanQuery']('age', 65);
      expect(result).toEqual({ age: { $lt: 65 } });
    });

    it('should return null if value is undefined', () => {
      const result = service['buildLessThanQuery']('age', undefined);
      expect(result).toBeNull();
    });
  });

  describe('buildLikeQuery', () => {
    it('should return a query with $regex operator when value is provided', () => {
      const result = service['buildLikeQuery']('description', 'test');
      expect(result).toEqual({ description: { $regex: 'test' } });
    });

    it('should convert non-string values to string and build $regex query', () => {
      const result = service['buildLikeQuery']('description', 123);
      expect(result).toEqual({ description: { $regex: '123' } });
    });

    it('should return null if value is undefined', () => {
      const result = service['buildLikeQuery']('description', undefined);
      expect(result).toBeNull();
    });
  });
});
