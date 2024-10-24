import { BadRequestException } from '@nestjs/common';
import { ValidateEmailPipe } from './validate-email.pipe';

describe('ValidateEmailPipe Test suite', () => {
  let pipe: ValidateEmailPipe;

  beforeEach(async () => {
    pipe = new ValidateEmailPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should validate that a string is an email', () => {
      const email = 'it21058578@my.sliit.lk';

      pipe.transform(email, {} as any);
    });

    it('should throw when value is not an email', () => {
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
