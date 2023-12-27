import { expect, test } from "bun:test";
import { SheetWithBaseScores } from "../test/TestCharacters.test";
import { Barbarian, TestFeature } from "./Barbarian";

test("add features on level up", () => {
  const sheet = SheetWithBaseScores();
  sheet.clazz = new Barbarian();

  expect(sheet.clazz.level).toEqual(0);
  expect(sheet.clazz.features).toEqual([]);

  sheet.clazz.levelUp();

  expect(sheet.clazz.level).toEqual(1);
  expect(sheet.clazz.features).toEqual([new TestFeature()]);
});
