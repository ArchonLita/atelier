import { expect, test } from "bun:test";
import { SheetWithBaseScores } from "../test/TestCharacters.test";
import { Barbarian, TestFeature } from "./Barbarian";

test("add features on level up", () => {
  const sheet = SheetWithBaseScores();
  sheet.clazz = new Barbarian();
  sheet.load();

  expect(sheet.maxHitPoints).toEqual(0);
  expect(sheet.clazz.level).toEqual(0);

  sheet.clazz.levelUp();
  sheet.load();

  expect(sheet.maxHitPoints).toEqual(13);
  expect(sheet.clazz.level).toEqual(1);
  expect(
    sheet.clazz.features.filter((f) => f instanceof TestFeature).length,
  ).toBeGreaterThan(0);

  sheet.clazz.levelUp();
  sheet.load();

  expect(sheet.maxHitPoints).toEqual(21);
  expect(sheet.clazz.level).toEqual(2);
});
