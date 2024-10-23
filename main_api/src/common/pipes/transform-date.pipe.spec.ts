import { BadRequestException } from '@nestjs/common';
import { TransformDatePipe } from './transform-date.pipe';

describe('TransformDatePipe Test suite', () => {
  let pipe: TransformDatePipe;

  beforeEach(async () => {
    pipe = new TransformDatePipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should validate transform a string into a date', () => {
      const email = '2001-12-05';

      const result = pipe.transform(email, {} as any);

      expect(result.getFullYear()).toBe(2001);
      expect(result.getMonth()).toBe(11);
      expect(result.getDate()).toBe(5);
    });

    it('should throw when string is not in a valid format', () => {
      const value = null;

      let error: Error | undefined;

      try {
        pipe.transform(value as any, {} as any);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(BadRequestException);
    });
  });
});
