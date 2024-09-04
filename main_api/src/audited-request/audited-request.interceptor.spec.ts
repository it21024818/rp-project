import { AuditedRequestInterceptor } from './audited-request.interceptor';

describe('AuditedRequestInterceptor', () => {
  it('should be defined', () => {
    expect(new AuditedRequestInterceptor()).toBeDefined();
  });
});
