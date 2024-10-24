import { BadRequestException } from '@nestjs/common';
import { ValidateObjectIdPipe } from './validate-object-id.pipe';

describe('ValidateObjectIdPipe Test suite', () => {
  let pipe: ValidateObjectIdPipe;

  beforeEach(async () => {
    pipe = new ValidateObjectIdPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should validate that a string is an object id', () => {
      const value = '67187d9066cd5812be46e2d3';

      pipe.transform(value, {} as any);
    });

    it('should throw when value is not a valid object id', () => {
      const value = 'not-valid';

      let error: Error | undefined;

      try {
        pipe.transform(value, {} as any);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(BadRequestException);
    });
  });
});
