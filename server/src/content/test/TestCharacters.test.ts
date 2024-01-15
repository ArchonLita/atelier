import { Sheet } from "../../dnd/Sheet";
import { Barbarian, ProficiencyFeature } from "../classes/Barbarian";

export function SheetWithBaseScores() {
  const sheet = new Sheet();
  sheet.name = "Lita";
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

export function SheetBarbarian() {
  const sheet = new Sheet();
  sheet.name = "Petroff";

  sheet.baseAbilityScores = {
    strength: 15,
    dexterity: 13,
    constitution: 15,
    intelligence: 8,
    wisdom: 12,
    charisma: 10,
  };

  const clazz = new Barbarian();
  // TODO make this more ergonomic ayaya
  (clazz.features[1] as ProficiencyFeature).skills.select(2);
  (clazz.features[1] as ProficiencyFeature).skills.select(4);
  sheet.clazz = clazz;
  clazz.levelUp(sheet);

  return sheet;
}

// test("debug", () => {
//   const sheet = SheetBarbarian();
//   sheet.load();
//   sheet.displayInformation();
// });
