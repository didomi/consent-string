import { IdsStatuses } from '@/common/ids-statuses';
import { encodeRangesFibonacci } from "./encoder";

describe('encodeRangesFibonacci', () => {
  it('should encode range numbers with enabled then disabled IDs', () => {
    const value = new IdsStatuses([1, 3], [2, 4]);

    const result = encodeRangesFibonacci(value);

    expect(result.toString()).toBe(
      '10' + // EncodingAlgorithm

      '0001' + // EncodedStatuses (enabled then disabled)

      '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status

      // Range 1 of enabled status
      '11' + // FibonacciRangeStart (1)
      '11' + // FibonacciNumberIdsInRange (1)

      // Range 2 of enabled status
      '0011' + // FibonacciRangeStart (3)
      '11' + // FibonacciNumberIdsInRange (1)

      '0000000000000010' + // NumberOfRanges (2 ranges) for disabled status

      // Range 1 of disabled status
      '011' + // FibonacciRangeStart (2)
      '11' + // FibonacciNumberIdsInRange (1)

      // Range 2 of disabled status
      '1011' + // FibonacciRangeStart (4)
      '11' // FibonacciNumberIdsInRange (1)
    );
  });

  it('should encode range numbers with only enabled IDs', () => {
    const value = new IdsStatuses([1, 3], []);

    const result = encodeRangesFibonacci(value);

    expect(result.toString()).toBe(
      '10' + // EncodingAlgorithm

      '0000' + // EncodedStatuses (enabled only)

      '0000000000000010' + // NumberOfRanges (2 ranges) for enabled status

      // Range 1 of enabled status
      '11' + // FibonacciRangeStart (1)
      '11' + // FibonacciNumberIdsInRange (1)

      // Range 2 of enabled status
      '0011' + // FibonacciRangeStart (3)
      '11' // FibonacciNumberIdsInRange (1)
    );
  });

  it('should encode range numbers with only disabled IDs', () => {
    const value = new IdsStatuses([], [2, 4]);

    const result = encodeRangesFibonacci(value);

    expect(result.toString()).toBe(
      '10' + // EncodingAlgorithm

      '0101' + // EncodedStatuses (disabled only)

      '0000000000000010' + // NumberOfRanges (2 ranges) for disabled status

      // Range 1 of disabled status
      '011' + // FibonacciRangeStart (2)
      '11' + // FibonacciNumberIdsInRange (1)

      // Range 2 of disabled status
      '1011' + // FibonacciRangeStart (4)
      '11' // FibonacciNumberIdsInRange (1)
    );
  });

  it('should encode range numbers with disabled then undefined IDs', () => {
    const value = new IdsStatuses([2, 3], [1, 5]);

    const result = encodeRangesFibonacci(value);

    expect(result.toString()).toBe(
      '10' + // EncodingAlgorithm

      '0111' + // EncodedStatuses (disabled then undefined)

      '0000000000000010' + // NumberOfRanges (2 ranges) for disabled status

      // Range 1 of disabled status
      '11' + // FibonacciRangeStart (1)
      '11' + // FibonacciNumberIdsInRange (1)

      // Range 2 of disabled status
      '00011' + // FibonacciRangeStart (5)
      '11' + // FibonacciNumberIdsInRange (1)

      '0000000000000001' + // NumberOfRanges (1 range) for undefined status

      // Range 1 of undefined status
      '1011' + // FibonacciRangeStart (4)
      '11' // FibonacciNumberIdsInRange (1)
    );
  });

  it('should encode range numbers with multiple IDs in a range', () => {
    const value = new IdsStatuses([1, 2], [3, 4]);

    const result = encodeRangesFibonacci(value);

    expect(result.toString()).toBe(
      '10' + // EncodingAlgorithm

      '0001' + // EncodedStatuses (enabled then disabled)

      '0000000000000001' + // NumberOfRanges (1 range) for enabled status

      // Range 1 of enabled status
      '11' + // FibonacciRangeStart (1)
      '011' + // FibonacciNumberIdsInRange (2)

      '0000000000000001' + // NumberOfRanges (1 range) for disabled status

      // Range 1 of disabled status
      '0011' + // FibonacciRangeStart (3)
      '011' // FibonacciNumberIdsInRange (2)
    );
  });

  it('should encode range numbers with a mix of single and multiple IDs in ranges', () => {
    const value = new IdsStatuses([1], [3, 4]);

    const result = encodeRangesFibonacci(value);

    expect(result.toString()).toBe(
      '10' + // EncodingAlgorithm

      '0001' + // EncodedStatuses (enabled then disabled)

      '0000000000000001' + // NumberOfRanges (1 range) for enabled status

      // Range 1 of enabled status
      '11' + // FibonacciRangeStart (1)
      '11' + // FibonacciNumberIdsInRange (1)

      '0000000000000001' + // NumberOfRanges (1 range) for disabled status

      // Range 1 of disabled status
      '0011' + // FibonacciRangeStart (3)
      '011' // FibonacciNumberIdsInRange (2)
    );
  });
});
