import { Sheet } from "./Sheet";
import { expect, test } from "bun:test";
import { testSerialization } from "../api/Data.test";

const baseAbilityScores = {
  strength: 8,
  wisdom: 10,
  charisma: 12,
  dexterity: 13,
  constitution: 14,
  intelligence: 15,
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
  const sheet = new Sheet();
  sheet.baseAbilityScores = baseAbilityScores;
  sheet.load();

  expect(sheet.abilityScores).toEqual(baseAbilityScores);
  expect(sheet.abilityModifiers).toEqual(expectedModifiers);
});

test("serialize and deserialize character sheets", () => {
  const sheet = new Sheet();
  sheet.name = "Mear";
  sheet.baseAbilityScores = baseAbilityScores;
  sheet.load();

  const data = {
    baseAbilityScores,
    feats: [],
    hitPoints: 0,
    name: "Mear",
    equipment: [],
  };

  testSerialization(sheet, data, Sheet);
});
