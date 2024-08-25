import logger, { labeledLogger } from '@modules/logger';

describe('logger', () => {
  beforeAll(() => {
    jest.resetAllMocks();
  });

  it('should log a string message', () => {
    const logSpy = jest.spyOn(logger, 'info');
    logger.info('Test message');
    expect(logSpy).toHaveBeenCalled();
  });

  it('should log an object message', () => {
    const logSpy = jest.spyOn(logger, 'info');
    logger.info({ message: 'Test message', word: 'tree' });
    expect(logSpy).toHaveBeenCalled();
  });

  it('should create a labelled logger', () => {
    const log = labeledLogger('test');
    log.info('Test message');
    expect(log).toBeDefined();
  });
});
