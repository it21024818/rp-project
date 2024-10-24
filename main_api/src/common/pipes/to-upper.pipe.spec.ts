import { BadRequestException } from '@nestjs/common';
import { ToUpperPipe } from './to-upper.pipe';

describe('ToUpperPipe Test suite', () => {
  let pipe: ToUpperPipe;

  beforeEach(async () => {
    pipe = new ToUpperPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should transform a string into uppercase', () => {
      const value = 'test';

      const result = pipe.transform(value, {} as any);

      expect(result).toBe('TEST');
    });

    it('should throw when value is not a string', () => {
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
