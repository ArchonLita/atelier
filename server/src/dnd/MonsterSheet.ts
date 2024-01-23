import { Property } from "../api/Data";
import { Sheet } from "./Sheet";

// Random Constructs
// Character Sheet
export class MonsterSheet extends Sheet {
  constructor() {
    super();
  }

  name: string = "";

  // todo: consider size

  tags: Set<string> = new Set<string>();

  challengeRating: number = 0;

  load() {
    this.proficiencyBonus = Math.floor(this.challengeRating / 4) + 2;
    super.load();
  }

  reload() {
    this.unload();
    this.load();
  }
}
