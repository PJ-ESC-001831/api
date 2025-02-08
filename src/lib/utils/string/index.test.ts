import { generatePublicId } from './index';
describe('utils:string', () => {
  describe('generatePublicId', () => {
    let publicId: string;
    beforeAll(() => {
      publicId = generatePublicId();
    });

    it('should return a string', () => {
      expect(typeof publicId).toBe('string');
    });

    it('should be 16 characters long', () => {
      expect(publicId.length).toBe(16);
    });
  });
});
