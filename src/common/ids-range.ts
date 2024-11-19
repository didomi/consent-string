import { FibonacciNumberIdsRange } from './fibonacci-number-ids-range';
import { FibonacciNumber } from './fibonacci-number';
export class IdsRange {
  public constructor(readonly startId: number, readonly endId: number) {}
  public get numberOfIds(): number {
    return this.endId - this.startId + 1;
  }
  public get isSingleIdRange(): boolean {
    return this.endId === this.startId;
  }
  public toFibonacciNumberIdsRange(): FibonacciNumberIdsRange {
    return new FibonacciNumberIdsRange(
      new FibonacciNumber(this.startId),
      new FibonacciNumber(this.numberOfIds),
    );
  }
}
