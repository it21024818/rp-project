import { Test, TestingModule } from '@nestjs/testing';
import { AuditedRequestController } from './audited-request.controller';

describe('AuditedRequestController', () => {
  let controller: AuditedRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditedRequestController],
    }).compile();

    controller = module.get<AuditedRequestController>(AuditedRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
