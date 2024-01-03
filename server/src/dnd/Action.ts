import { Sheet } from "./Sheet";

export interface Action {
  call: (user: Sheet, target: Sheet) => void;
}
