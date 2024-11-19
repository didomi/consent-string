import { Ranges } from './ranges';
import { IdsRange } from './ids-range';
import { Status } from './ids-statuses';

export class IdsRanges extends Ranges<IdsRange> {
  public constructor(status: Status) {
    super(status);
  }
  createRange(startId: number, endId: number): IdsRange {
    return new IdsRange(startId, endId);
  }
}
