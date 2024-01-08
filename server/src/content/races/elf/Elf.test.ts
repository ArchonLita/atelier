import { expect, test } from "bun:test";
import { Elf } from "./Elf";
import { testSerialization } from "../../../api/Data.test";
import { SheetWithBaseScores } from "../../test/TestCharacters.test";

test("create elf", () => {
  const sheet = SheetWithBaseScores();
  sheet.race = new Elf();
  sheet.reload();

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
