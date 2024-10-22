import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Token } from './token.schema';
import { TokenService } from './token.service';

describe('Token Test suite', () => {
  let service: TokenService;
  let tokenModel: Model<Token>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TokenService, { provide: getModelToken(Token.name), useValue: createMock<Model<Token>>() }],
    }).compile();

    service = module.get<TokenService>(TokenService);
    tokenModel = module.get<Model<Token>>(getModelToken(Token.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
