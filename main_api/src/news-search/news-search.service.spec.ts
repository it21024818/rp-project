import { Test, TestingModule } from '@nestjs/testing';
import { NewsSearchService } from './news-search.service';

describe('NewsSearchService', () => {
  let service: NewsSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsSearchService],
    }).compile();

    service = module.get<NewsSearchService>(NewsSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
