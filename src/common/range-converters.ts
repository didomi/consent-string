import { FibonacciNumber } from './fibonacci-number';
import { FibonacciNumberIdsRange } from './fibonacci-number-ids-range';
import { IdsRange } from './ids-range';

export class RangeConverters {
  public static toFibonacciNumberIdsRange(
    range: IdsRange,
  ): FibonacciNumberIdsRange {
    return new FibonacciNumberIdsRange(
      new FibonacciNumber(range.startId),
      new FibonacciNumber(range.numberOfIds),
    );
  }

  public static toIdsRange(range: FibonacciNumberIdsRange): IdsRange {
    return new IdsRange(range.startId.number, range.endId.number);
  }
}
