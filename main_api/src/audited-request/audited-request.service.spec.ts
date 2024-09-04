import { Test, TestingModule } from '@nestjs/testing';
import { AuditedRequestService } from './audited-request.service';

describe('AuditedRequestService', () => {
  let service: AuditedRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditedRequestService],
    }).compile();

    service = module.get<AuditedRequestService>(AuditedRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
