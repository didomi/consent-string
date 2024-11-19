import { Status } from './ids-statuses';
import { IdsRange } from './ids-range';
import { FibonacciNumberIdsRange } from '@/common/fibonacci-number-ids-range';
import { MIN_ID } from '@/constants/constants';

export type RangeType = IdsRange | FibonacciNumberIdsRange;

export abstract class Ranges<RangeType> {
  public ranges = new Array<RangeType>();
  public constructor(readonly status: Status) { }
  public get numberOfRanges(): number {
    return this.ranges.length;
  }
  public add(range: RangeType) {
    this.ranges.push(range);
  }
  public get(index: number): RangeType {
    return this.ranges[index];
  }

  abstract createRange(startId: number, endId: number): RangeType;

  public fromIds(ids: Array<number>): Ranges<RangeType> {
    let startId = MIN_ID;
    let endId = MIN_ID;
    for (const id of ids) {
      if (startId === MIN_ID) {
        startId = id;
        endId = id;
        continue;
      }
      if (id === endId + 1) {
        endId = id;
      } else {
        this.ranges.push(this.createRange(startId, endId));
        startId = id;
        endId = id;
      }
    }
    if (endId != MIN_ID) {
      this.ranges.push(this.createRange(startId, endId));
    }
    return this;
  }
}
