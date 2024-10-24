import { customsearch } from '@googleapis/customsearch';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ConfigKey } from 'src/common/enums/config-key.enum';
import { NewsSearchService } from './news-search.service';

jest.mock('@googleapis/customsearch', () => ({
  customsearch: jest.fn(),
}));

describe('NewsSearch Test suite', () => {
  let service: NewsSearchService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NewsSearchService, { provide: ConfigService, useValue: { get: jest.fn() } }],
    }).compile();

    service = module.get<NewsSearchService>(NewsSearchService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('performSearch', () => {
    it('should return search results when API returns items', async () => {
      // Given
      const searchQuery = 'latest news';
      const googleApiKey = 'mockApiKey';
      const googleCustomSearchEngineId = 'mockCx';
      const mockItems = [
        {
          title: 'News Title 1',
          snippet: 'Description 1',
          link: 'http://example.com/1',
          pagemap: { cse_thumbnail: [{ src: 'http://example.com/thumbnail1.jpg' }] },
        },
        {
          title: 'News Title 2',
          snippet: 'Description 2',
          link: 'http://example.com/2',
        },
      ];

      // Mock configuration values
      jest.spyOn(configService, 'get').mockImplementation((key: ConfigKey) => {
        if (key === ConfigKey.GOOGLE_API_KEY) return googleApiKey;
        if (key === ConfigKey.GOOGLE_CUSTOM_SEARCH_ENGINE_ID) return googleCustomSearchEngineId;
        return null;
      });

      // Mock API response
      (customsearch as jest.Mock).mockReturnValue({
        cse: {
          list: jest.fn().mockResolvedValue({ data: { items: mockItems } }),
        },
      });

      // When
      const result = await service.performSearch(searchQuery);

      // Then
      expect(result).toEqual([
        {
          title: 'News Title 1',
          description: 'Description 1',
          link: 'http://example.com/1',
          thumbnail: [{ src: 'http://example.com/thumbnail1.jpg' }],
        },
        {
          title: 'News Title 2',
          description: 'Description 2',
          link: 'http://example.com/2',
          thumbnail: undefined,
        },
      ]);
    });

    it('should return an empty array when no results are found', async () => {
      // Given
      const searchQuery = 'no results';
      const googleApiKey = 'mockApiKey';
      const googleCustomSearchEngineId = 'mockCx';

      // Mock configuration values
      jest.spyOn(configService, 'get').mockImplementation((key: ConfigKey) => {
        if (key === ConfigKey.GOOGLE_API_KEY) return googleApiKey;
        if (key === ConfigKey.GOOGLE_CUSTOM_SEARCH_ENGINE_ID) return googleCustomSearchEngineId;
        return null;
      });

      // Mock API response
      (customsearch as jest.Mock).mockReturnValue({
        cse: {
          list: jest.fn().mockResolvedValue({ data: { items: [] } }),
        },
      });

      // When
      const result = await service.performSearch(searchQuery);

      // Then
      expect(result).toEqual([]);
    });

    it('should return an empty array when items are undefined', async () => {
      // Given
      const searchQuery = 'undefined items';
      const googleApiKey = 'mockApiKey';
      const googleCustomSearchEngineId = 'mockCx';

      // Mock configuration values
      jest.spyOn(configService, 'get').mockImplementation((key: ConfigKey) => {
        if (key === ConfigKey.GOOGLE_API_KEY) return googleApiKey;
        if (key === ConfigKey.GOOGLE_CUSTOM_SEARCH_ENGINE_ID) return googleCustomSearchEngineId;
        return null;
      });

      // Mock API response
      (customsearch as jest.Mock).mockReturnValue({
        cse: {
          list: jest.fn().mockResolvedValue({ data: {} }), // No items key
        },
      });

      // When
      const result = await service.performSearch(searchQuery);

      // Then
      expect(result).toEqual([]);
    });

    it('should throw an error when API call fails', async () => {
      // Given
      const searchQuery = 'error search';
      const googleApiKey = 'mockApiKey';
      const googleCustomSearchEngineId = 'mockCx';
      const expectedError = new Error('API Error');

      // Mock configuration values
      jest.spyOn(configService, 'get').mockImplementation((key: ConfigKey) => {
        if (key === ConfigKey.GOOGLE_API_KEY) return googleApiKey;
        if (key === ConfigKey.GOOGLE_CUSTOM_SEARCH_ENGINE_ID) return googleCustomSearchEngineId;
        return null;
      });

      // Mock API response
      (customsearch as jest.Mock).mockReturnValue({
        cse: {
          list: jest.fn().mockRejectedValue(expectedError), // Simulate API error
        },
      });

      // When & Then
      let error: Error | undefined = undefined;
      try {
        await service.performSearch(searchQuery);
      } catch (e) {
        error = e;
      }

      expect(error).toEqual(expectedError);
    });
  });
});
