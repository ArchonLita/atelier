import { expect, test } from "bun:test";
import { Property } from "../api/Data";
import { testSerialization } from "../api/Data.test";
import { PaddedArmor } from "../content/equipment/Armor";
import { Battleaxe } from "../content/equipment/weapons/MartialMelee";
import { SheetWithBaseScores } from "../content/test/TestCharacters.test";
import { SRDEquipment, Equipment } from "./Equipment";

class TestInventory {
  @Property(SRDEquipment)
  equipment: Equipment[] = [];
}

test("serialize equipment", () => {
  const inventory = new TestInventory();
  const item = new Battleaxe();
  item.quantity = 4;
  inventory.equipment.push(item);
  const data = {
    equipment: [
      {
        _id: "Battleaxe",
        quantity: 4,
      },
    ],
  };

  testSerialization(inventory, data, TestInventory);
});

test("apply equipment effects", () => {
  const sheet = SheetWithBaseScores();
  sheet.load();
  expect(sheet.armorClass).toEqual(12);

  sheet.armor = new PaddedArmor();
  sheet.load();
  expect(sheet.armorClass).toEqual(13);
});
