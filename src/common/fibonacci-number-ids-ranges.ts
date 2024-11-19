import { Ranges } from './ranges';
import { FibonacciNumberIdsRange } from './fibonacci-number-ids-range';
import { Status } from './ids-statuses';
import { FibonacciNumber } from './fibonacci-number';

export class FibonacciNumberIdsRanges extends Ranges<FibonacciNumberIdsRange> {
  public constructor(status: Status) {
    super(status);
  }
  createRange(startId: number, endId: number): FibonacciNumberIdsRange {
    return new FibonacciNumberIdsRange(
      new FibonacciNumber(startId),
      new FibonacciNumber(endId - startId + 1),
    );
  }
}
