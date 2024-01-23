import { expect, test } from "bun:test";
import { SheetWithBaseScores } from "../test/TestCharacters.test";
import { Barbarian, EquipmentFeature, TestFeature } from "./Barbarian";

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

test("claim equipment", () => {
  const sheet = SheetWithBaseScores();
  sheet.clazz = new Barbarian();
  sheet.load();
  sheet.clazz.levelUp();
  sheet.load();

  // Equipment is initially unclaimed
  const equipment = sheet.clazz.features[2] as EquipmentFeature;
  expect(equipment.claimed).toBeFalse();

  // Cannot claim equipment if options are not selected
  equipment.claim();
  expect(equipment.claimed).toBeFalse();

  // This should select options properly
  expect(
    equipment.options.select([
      [0, 0],
      [1, 0],
      [2, 0],
    ]),
  ).toBeTrue();

  // Claiming equipment should change claimed flag and update inventory
  equipment.claim();
  expect(equipment.claimed).toBeTrue();
  expect(sheet.equipment.map((e) => e.name)).toEqual([
    "Greataxe",
    "Handaxe",
    "Javelin",
  ]);
});
