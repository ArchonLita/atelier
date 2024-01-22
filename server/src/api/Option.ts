import { Property } from "./Data";
import { hasDuplicates } from "./Util";

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

interface Model<T> {
  readonly count: number;
  readonly options: (Model<T> | T)[];
}

function isModel<T>(obj: any): obj is Model<T> {
  return typeof obj.count === "number" && Array.isArray(obj.options);
}

type Selection = [...(number | Selection)[]];

function getSelection<T>(model: Model<T>, selection: Selection): T[] {
  const res: T[] = [];
  for (const item of selection) {
    if (Array.isArray(item)) {
      res.push(
        ...getSelection(
          model.options[item[0] as number] as Model<T>,
          item.slice(1),
        ),
      );
    } else {
      res.push(model.options[item] as T);
    }
  }

  return res;
}

// TODO handle selecting something twice (not supposed to happen)
function validateSelection<T>(model: Model<T>, selection: Selection): boolean {
  if (selection.length !== model.count) return false;
  if (
    hasDuplicates(
      selection.map((item) => (typeof item === "number" ? item : item[0])),
    )
  )
    return false;

  for (const item of selection) {
    if (typeof item === "number") {
      if (isModel(model.options[item])) return false;
    } else {
      if (
        typeof item[0] !== "number" ||
        !isModel(model.options[item[0]]) ||
        !validateSelection(model.options[item[0]] as Model<T>, item.slice(1))
      )
        return false;
    }
  }

  return true;
}

export abstract class MultiOptions<T> {
  abstract readonly model: Model<T>;

  selected: T[] = [];

  select(selection: Selection) {
    const valid = validateSelection(this.model, selection);
    if (valid) this.selected = getSelection(this.model, selection);

    return valid;
  }
}
