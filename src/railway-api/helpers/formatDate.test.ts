import formatDate from './formatDate';

describe('helpers', () => {
  describe('formatDate', () => {
    it('Works for day < 10', () => {
      expect(formatDate(new Date(2018, 11, 9))).toEqual('09-12-2018');
    });

    it('Works for month < 10', () => {
      expect(formatDate(new Date(2018, 8, 10))).toEqual('10-09-2018');
    });
  });
});
