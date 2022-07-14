import * as index from './index';

describe(__filename, () => {
  describe('v1', () => {
    it('has parse and generate methods', () => {
      // Assert
      expect(index.v1).not.toBeNull();
      expect(typeof index.v1.parse).toBe('function');
      expect(typeof index.v1.generate).toBe('function');
    });
  });
});
