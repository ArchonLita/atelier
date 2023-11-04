import { expect, test } from "bun:test";
import { Sheet } from "../../../dnd/Sheet";
import { Elf } from "./Elf";

test("create elf", () => {
  const sheet = new Sheet();
  sheet.baseAbilityScores = {
    strength: 8,
    dexterity: 15,
    constitution: 13,
    intelligence: 15,
    wisdom: 12,
    charisma: 10,
  };
  sheet.setRace(new Elf());
  sheet.load();

  expect(sheet.speed).toEqual(30);
  expect(sheet.abilityScores.dexterity).toEqual(
    sheet.baseAbilityScores.dexterity + 2,
  );
});
