import { FibonacciNumber } from './fibonacci-number';

export class FibonacciNumberIdsRange {
  public constructor(readonly startId: FibonacciNumber, readonly numberOfIds: FibonacciNumber) { }

  public get endId(): FibonacciNumber {
    return new FibonacciNumber(this.startId.number + this.numberOfIds.number - 1);
  }
}
