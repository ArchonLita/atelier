import { Sheet } from "../../dnd/Sheet";

export function SheetWithBaseScores() {
  const sheet = new Sheet();
  sheet.baseAbilityScores = {
    strength: 8,
    dexterity: 15,
    constitution: 13,
    intelligence: 15,
    wisdom: 12,
    charisma: 10,
  };

  return sheet;
}
