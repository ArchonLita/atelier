import { expect, test } from "bun:test";
import {
  SheetBarbarian,
  SheetWithBaseScores,
} from "../content/test/TestCharacters.test";
import { Battleaxe } from "../content/equipment/weapons/MartialMelee";
import { WeaponAction } from "./Equipment";

test("execute weapon actions", () => {
  const sheet = SheetBarbarian();
  const weapon = new Battleaxe();

  sheet.equipment.push(weapon);
  sheet.load();

  expect(sheet.actions).toEqual([new WeaponAction(weapon)]);

  const target = SheetWithBaseScores();
  target.load();

  sheet.actions[0].call(sheet, target);
});
