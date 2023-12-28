import { expect, test } from "bun:test";
import { SheetWithBaseScores } from "../test/TestCharacters.test";
import { Barbarian, TestFeature } from "./Barbarian";

test("add features on level up", () => {
  const sheet = SheetWithBaseScores();
  sheet.clazz = new Barbarian();
  sheet.load();

  expect(sheet.maxHitPoints).toEqual(0);
  expect(sheet.clazz.level).toEqual(0);
  expect(sheet.clazz.features).toEqual([]);

  sheet.clazz.levelUp(sheet);
  sheet.load();

  expect(sheet.maxHitPoints).toEqual(13);
  expect(sheet.clazz.level).toEqual(1);
  expect(sheet.clazz.features).toEqual([new TestFeature()]);

  sheet.clazz.levelUp(sheet);
  sheet.load();

  expect(sheet.maxHitPoints).toEqual(21);
  expect(sheet.clazz.level).toEqual(2);
  expect(sheet.clazz.features).toEqual([new TestFeature()]);
});

test("serialize barbarian class", () => {
  const sheet = SheetWithBaseScores();
  sheet.clazz = new Barbarian();
  sheet.load();

  sheet.clazz.levelUp(sheet);
  sheet.load();

  // TODO
  // console.log(serialize(sheet.clazz));
});
