import { FibonacciNumber } from './fibonacci-number';
import { IdsRange } from './ids-range';

export class FibonacciNumberIdsRange {
  public constructor(readonly startId: FibonacciNumber, readonly numberOfIds: FibonacciNumber) {}
  public get endId(): FibonacciNumber {
    return new FibonacciNumber(this.startId.number + this.numberOfIds.number - 1);
  }
  public toIdsRange(): IdsRange {
    return new IdsRange(this.startId.number, this.endId.number);
  }
}
