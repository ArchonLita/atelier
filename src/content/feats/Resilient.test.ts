import { test, expect } from "bun:test";
import { Sheet } from "../../dnd/Sheet";
import { Resilient } from "./Resilient";

test("create sheet with Resilient", () => {
  const sheet = new Sheet();
  sheet.baseAbilityScores = {
    strength: 8,
    dexterity: 15,
    constitution: 13,
    intelligence: 15,
    wisdom: 12,
    charisma: 10,
  };
  sheet.addFeat(new Resilient("dexterity"));
  sheet.load();

  expect(sheet.abilityScores.dexterity).toEqual(
    sheet.baseAbilityScores.dexterity + 1,
  );
});
