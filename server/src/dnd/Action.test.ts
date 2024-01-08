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
  sheet.reload();

  expect(sheet.actions).toEqual([new WeaponAction(weapon)]);

  const target = SheetWithBaseScores();
  target.reload();

  sheet.actions[0].call(sheet, target);
});
