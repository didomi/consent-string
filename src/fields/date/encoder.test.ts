import { encodeDate } from './encoder';

describe('encodeDate', () => {
  it('should encode date correctly', () => {
    const date = new Date('2023-04-12T18:10:00.000Z');
    expect(encodeDate(date).toString()).toEqual(
      '001111101010001001011000011110110000',
    );
  });

  it('should encode string timestamp correctly', () => {
    const timestamp = '2023-04-12T18:10:00.000Z';
    expect(encodeDate(timestamp).toString()).toEqual(
      '001111101010001001011000011110110000',
    );
  });

  it('should produce identical results for Date object and equivalent string', () => {
    const dateObj = new Date('2023-05-15T12:30:45.000Z');
    const dateStr = '2023-05-15T12:30:45.000Z';

    expect(encodeDate(dateObj).toString()).toEqual(
      encodeDate(dateStr).toString(),
    );
  });

  it('should handle different string date formats', () => {
    // Using just date portion (time defaults to 00:00:00)
    const dateStr = '2023-06-20';
    const dateObj = new Date('2023-06-20T00:00:00.000Z');

    expect(encodeDate(dateStr).toString()).toEqual(
      encodeDate(dateObj).toString(),
    );
  });

  it('should handle numeric timestamp strings', () => {
    // Unix timestamp as string
    const unixTimestampStr = '1672531200000'; // 2023-01-01T00:00:00.000Z
    const dateObj = new Date(1672531200000);

    expect(encodeDate(unixTimestampStr).toString()).toEqual(
      encodeDate(dateObj).toString(),
    );
  });

  it('should handle edge case dates', () => {
    // Very old date
    const oldDate = '1970-01-01T00:00:01.000Z';
    expect(encodeDate(oldDate).toString()).toBeDefined();

    // Far future date
    const futureDate = '2100-12-31T23:59:59.999Z';
    expect(encodeDate(futureDate).toString()).toBeDefined();
  });

  it('should throw an error for invalid date strings', () => {
    // These strings should definitely be invalid and cause Date.parse to return NaN
    const invalidDateStrings = [
      'completely-invalid',
      'undefined',
      'NaN',
      '2023-99-99', // definitely invalid month and day
    ];

    invalidDateStrings.forEach(invalidDate => {
      expect(() => {
        encodeDate(invalidDate);
      }).toThrow(/Invalid date/);
    });
  });
});
