import { test, expect } from "bun:test";
import { Resilient } from "./Resilient";
import { SheetWithBaseScores } from "../test/TestCharacters.test";

test("create sheet with Resilient", () => {
  const sheet = SheetWithBaseScores();
  sheet.reload();
  expect(sheet.savingModifiers.dexterity).toEqual(2);
  expect(sheet.savingProficiencies.dexterity).toEqual(false);

  sheet.feats.push(new Resilient("dexterity"));
  sheet.reload();
  expect(sheet.savingModifiers.dexterity).toEqual(4);
  expect(sheet.savingProficiencies.dexterity).toEqual(true);
});
