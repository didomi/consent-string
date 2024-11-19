import { MIN_ID, MAX_ID } from '@/constants/constants';
import { IdsRanges } from '@/common/ids-ranges';
import { PurposesVendors } from '@/types/purposes-vendors.type';

export enum Status {
  Undefined = 0,
  Disabled = 1,
  Enabled = 2,
}

export const BIT_SET_TO_STATUS: Map<string, Status> = new Map([
  ['00', Status.Undefined],
  ['01', Status.Disabled],
  ['10', Status.Enabled],
]);

export const STATUS_TO_BIT_SET: Map<Status, string> = new Map([
  [Status.Undefined, '00'],
  [Status.Disabled, '01'],
  [Status.Enabled, '10'],
]);

export const ENCODED_STATUSES_MAP: Map<string, Array<Status>> = new Map([
  ['0000', [Status.Enabled]],
  ['0001', [Status.Enabled, Status.Disabled]],
  ['0011', [Status.Enabled, Status.Undefined]],
  ['0100', [Status.Disabled, Status.Enabled]],
  ['0101', [Status.Disabled]],
  ['0111', [Status.Disabled, Status.Undefined]],
  ['1100', [Status.Undefined, Status.Enabled]],
  ['1101', [Status.Undefined, Status.Disabled]],
  ['1111', [Status.Undefined]],
]);

export const ENCODED_STATUSES_REVERSE_MAP: Map<string, string> = new Map([
  ['10', '0000'],
  ['1001', '0001'],
  ['1000', '0011'],
  ['0110', '0100'],
  ['01', '0101'],
  ['0100', '0111'],
  ['0010', '1100'],
  ['0001', '1101'],
  ['00', '1111'],
]);

/**
 * Returns status array string code
 * @param statuses status array with 1 or 2 elements
 * @returns string code for status array
 */
export function getStringCodeFromStatusArray(statuses: Array<Status>): string {
  return statuses.reduce((result, status) => (result += STATUS_TO_BIT_SET.get(status)), '');
}

/**
 * This class store Purposes and Vendors IDs statuses: Enabled, Disabled and Undefined;
 *
 *  The IDs must be the natural numbers between `MIN_ID` and `MAX_ID`: `MIN_ID` < `id` < `MAX_ID`
 *
 */
export class IdsStatuses {
  readonly minimumID: number;
  readonly maximumID: number;
  readonly undefinedIds: Array<number>;
  readonly minimumStatus?: Status;
  readonly maximumStatus?: Status;
  ranges?: Array<IdsRanges>;

  public constructor(readonly enabled: Array<number>, readonly disabled: Array<number>) {
    /**
     * We will calculate `maximumID` and `minimumID` for join `enabled` and `disabled` arrays
     *  but for now we set `maximumID` to `MIN_ID` and `minimumID` to `MAX_ID`
     *    to make sure that ids from enabled and disabled arrays will update these
     *      defaults values when we calculate them later in the code
     */
    this.maximumID = MIN_ID;
    this.minimumID = MAX_ID;

    this.undefinedIds = new Array<number>();

    if (this.isEmpty) {
      /**
       * For empty enabled and disabled we set both `maximumID` and `minimumID` to `MIN_ID`
       */
      this.maximumID = MIN_ID;
      this.minimumID = MIN_ID;
    } else {
      for (const id of [...this.enabled, ...this.disabled]) {
        this.minimumID = id < this.minimumID ? id : this.minimumID;
        this.maximumID = id > this.maximumID ? id : this.maximumID;
      }

      this.setUndefined();
      this.maximumStatus = this.getIdStatus(this.maximumID);
      this.minimumStatus = this.getIdStatus(this.minimumID);
    }
  }

  private setUndefined(): void {
    for (let id = this.minimumID; id <= this.maximumID; id++) {
      if (this.enabled.indexOf(id) == -1 && this.disabled.indexOf(id) == -1) {
        this.undefinedIds.push(id);
      }
    }
  }

  getIdStatus(id: number): Status {
    if (this.disabled.indexOf(id) !== -1) {
      return Status.Disabled;
    }
    if (this.enabled.indexOf(id) !== -1) {
      return Status.Enabled;
    }
    return Status.Undefined;
  }

  get isEmpty(): boolean {
    return this.enabled.length === 0 && this.disabled.length === 0;
  }

  get isStatusSameForMaxMinIds(): boolean {
    return this.maximumStatus === this.minimumStatus;
  }

  get numberOfEnabled(): number {
    return this.enabled.length;
  }

  get numberOfDisabled(): number {
    return this.disabled.length;
  }

  get numberOfUndefined(): number {
    return this.undefinedIds.length;
  }

  applyShift(shift: number) {
    if (this.isEmpty || shift === 0) {
      return;
    }
    for (const index in this.enabled) {
      this.enabled[index] += shift;
    }
    for (const index in this.disabled) {
      this.disabled[index] += shift;
    }
    for (const index in this.undefinedIds) {
      this.undefinedIds[index] += shift;
    }

    this.ranges = undefined;
  }

  getRanges(): Array<IdsRanges> {
    if (this.ranges) {
      return this.ranges;
    }

    this.ranges = this.toRanges();

    return this.ranges;
  }

  toRanges(): Array<IdsRanges> {
    if (this.isEmpty) {
      return [new IdsRanges(Status.Enabled)];
    }

    const predicate = (a: number, b: number) => a - b;
    const enabledRanges = new IdsRanges(Status.Enabled).fromIds(this.enabled.sort(predicate));
    const disabledRanges = new IdsRanges(Status.Disabled).fromIds(this.disabled.sort(predicate));

    let statusesRanges = [enabledRanges, disabledRanges];

    if (this.isStatusSameForMaxMinIds) {
      const undefinedRanges = new IdsRanges(Status.Undefined).fromIds(
        this.undefinedIds.sort(predicate),
      );

      if (this.minimumStatus === Status.Enabled) {
        if (disabledRanges.numberOfRanges >= undefinedRanges.numberOfRanges) {
          statusesRanges = [enabledRanges, undefinedRanges];
        }
      } else {
        if (enabledRanges.numberOfRanges >= undefinedRanges.numberOfRanges) {
          statusesRanges = [disabledRanges, undefinedRanges];
        }
      }
    }

    return statusesRanges.filter(ranges => ranges.numberOfRanges > 0);
  }

  static fromRanges(statusesRanges: Array<IdsRanges>): IdsStatuses {
    if (statusesRanges.length > 2 || statusesRanges.length == 0) {
      return new IdsStatuses([], []);
    }

    const statuses = {
      [Status.Enabled]: new Array<number>(),
      [Status.Disabled]: new Array<number>(),
      [Status.Undefined]: new Array<number>(),
    };

    for (const statusRanges of statusesRanges) {
      for (const range of statusRanges.ranges) {
        let id = range.startId;
        while (id <= range.endId) {
          statuses[statusRanges.status].push(id++);
        }
      }
    }

    /**
     * Restore status from other status and undefined, statuses arrays should be sorted
     * @param presentStatus status use to restore
     * @param missingStatus restoring status
     */
    const restoreStatusFromUndefined = (presentStatus: Status, missingStatus: Status) => {
      const length = statuses[presentStatus].length;
      const minId = statuses[presentStatus][0];
      const maxId = statuses[presentStatus][length - 1];
      for (let id = minId; id <= maxId; id++) {
        if (
          statuses[presentStatus].indexOf(id) === -1 &&
          statuses[Status.Undefined].indexOf(id) === -1
        ) {
          statuses[missingStatus].push(id);
        }
      }
    };

    if (statuses[Status.Undefined].length > 0) {
      if (statuses[Status.Enabled].length > 0) {
        restoreStatusFromUndefined(Status.Enabled, Status.Disabled);
      } else {
        restoreStatusFromUndefined(Status.Disabled, Status.Enabled);
      }
    }

    return new IdsStatuses(statuses[Status.Enabled], statuses[Status.Disabled]);
  }

  toPurposesVendors(): PurposesVendors {
    return { enabled: this.enabled, disabled: this.disabled };
  }
}
