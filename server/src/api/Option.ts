import { Property } from "./Data";

export abstract class Options<T> {
  @Property()
  public readonly selected: number[] = [];
  abstract readonly count: number;
  abstract readonly options: Readonly<T[]>;

  select(index: number) {
    if (this.selected.length < this.count) {
      this.selected.push(index);
      return true;
    }
    return false;
  }
}
