import { CharacterSheet, CharacterSheetData } from "./Character";
import { expect, test } from "bun:test";

const data: CharacterSheetData = {
  baseAbilityScores: {
    strength: 8,
    wisdom: 10,
    charisma: 12,
    dexterity: 13,
    constitution: 14,
    intelligence: 15,
  },
};

const expectedModifiers = {
  strength: -1,
  wisdom: 0,
  charisma: 1,
  dexterity: 1,
  constitution: 2,
  intelligence: 2,
};

test("constructs character sheets accurately", () => {
  const sheet = new CharacterSheet(data);

  expect(sheet.abilityScores).toEqual(data.baseAbilityScores);
  expect(sheet.abilityModifiers).toEqual(expectedModifiers);
});
