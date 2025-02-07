import { generatePublicId } from './index';
describe('utils:string', () => {
  describe('generatePublicId', () => {
    it('should return a string', () => {
      const publicId = generatePublicId();
      expect(typeof publicId).toBe('string');
    });
  });
});
