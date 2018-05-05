import padZero from './padZero';

describe('helpers', () => {
  describe('padZero', () => {
    it('Works for 0', () => {
      expect(padZero(0)).toEqual('00');
    });

    it('Works for one digit long positive numbers', () => {
      expect(padZero(1)).toEqual('01');
    });

    it('Works for two digit long positive numbers', () => {
      expect(padZero(10)).toEqual('10');
    });

    it('Works for more than two digit long positive numbers', () => {
      expect(padZero(100)).toEqual('100');
    });

    it('Throws error for negative numbers', () => {
      expect(padZero(-1)).toThrowError('padZero expects only positive numbers');
      expect(padZero(-100)).toThrowError('padZero expects positive numbers');
    });
  });
});
