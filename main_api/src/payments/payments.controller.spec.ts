import { Test, TestingModule } from '@nestjs/testing';
import { StripePaymentsController } from './payments.controller';

describe('PaymentsController', () => {
  let controller: StripePaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripePaymentsController],
    }).compile();

    controller = module.get<StripePaymentsController>(StripePaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
