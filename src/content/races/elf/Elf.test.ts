import { expect, test } from "bun:test";
import { Sheet } from "../../../dnd/Sheet";
import { Elf } from "./Elf";
import { testSerialization } from "../../../api/Data.test";

const baseAbilityScores = {
  strength: 8,
  dexterity: 15,
  constitution: 13,
  intelligence: 15,
  wisdom: 12,
  charisma: 10,
};

test("create elf", () => {
  const sheet = new Sheet();
  sheet.baseAbilityScores = baseAbilityScores;
  sheet.race = new Elf();
  sheet.load();

  expect(sheet.speed).toEqual(30);
  expect(sheet.abilityScores.dexterity).toEqual(
    sheet.baseAbilityScores.dexterity + 2,
  );
});

test("serialize elf", () => {
  const elf = new Elf();
  const expected = {
    traits: [
      {
        _id: "KeenSenses",
      },
      {
        _id: "FeyAncestry",
      },
      {
        _id: "Trance",
      },
    ],
  };

  testSerialization(elf, expected, Elf);
});
