export class IdsRange {
  public constructor(
    readonly startId: number,
    readonly endId: number,
  ) {}
  public get numberOfIds(): number {
    return this.endId - this.startId + 1;
  }
  public get isSingleIdRange(): boolean {
    return this.endId === this.startId;
  }
}
