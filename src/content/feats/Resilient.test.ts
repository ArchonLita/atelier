import { test, expect } from "bun:test";
import { Resilient } from "./Resilient";
import { SheetWithBaseScores } from "../test/TestCharacters.test";

test("create sheet with Resilient", () => {
  const sheet = SheetWithBaseScores();
  sheet.feats.push(new Resilient("dexterity"));
  sheet.load();

  expect(sheet.abilityScores.dexterity).toEqual(
    sheet.baseAbilityScores.dexterity + 1,
  );
});
