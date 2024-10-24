import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext, Logger } from '@nestjs/common';
import { LogGuard } from './log.guard';

describe('LogGuard Test suite', () => {
  let guard: LogGuard;
  let logger: Logger;

  beforeEach(() => {
    guard = new LogGuard();
    guard['logger'] = createMock<Logger>();
    logger = guard['logger'];
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should log the received request and return true', () => {
      // Given
      const context = createMock<ExecutionContext>();
      const request = {
        method: 'GET',
        path: '/test-path',
      };
      jest.spyOn(context.switchToHttp(), 'getRequest').mockReturnValue(request);
      const loggerLogSpy = jest.spyOn(logger, 'log').mockImplementation();

      // When
      const result = guard.canActivate(context);

      // Then
      expect(result).toBe(true);
      expect(loggerLogSpy).toHaveBeenCalledTimes(1);
      expect(loggerLogSpy).toHaveBeenCalledWith(`Request received to GET '/test-path'`);
    });
  });
});
