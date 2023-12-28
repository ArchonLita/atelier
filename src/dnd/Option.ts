import { Property } from "../api/Data";

export abstract class Options<T> {
  @Property()
  public readonly selected: number[] = [];
  public readonly count: number;

  constructor() {
    this.count = this.getOptions().length;
  }

  abstract getOptions(): T[];

  select(index: number) {
    if (this.selected.length < this.count) {
      this.selected.push(index);
      return true;
    }
    return false;
  }
}
