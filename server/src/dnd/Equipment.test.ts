import { expect, test } from "bun:test";
import { Property } from "../api/Data";
import { Equipment, Kit, KitOptions, SRDEquipment, coin } from "./Equipment";
import { testSerialization } from "../api/Data.test";
import { SheetWithBaseScores } from "../content/test/TestCharacters.test";
import { Battleaxe } from "../content/equipment/weapons/MartialMelee";
import { PaddedArmor } from "../content/equipment/Armor";
import { Javelin } from "../content/equipment/weapons/SimpleMelee";

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

test("claim items in kits", () => {
  class TestKitOptions1 extends KitOptions {
    count = 1;
    options = [new Battleaxe(), new Javelin()];
  }

  class TestKit extends Kit {
    name = "Test Kit";
    weight = 0;
    cost = coin("0 cp");

    options1 = new TestKitOptions1();
  }

  const sheet = SheetWithBaseScores();
  const kit = new TestKit();
  kit.load();
  sheet.equipment.push(kit);
  sheet.load();

  expect(sheet.equipment.map((e) => e.name)).toEqual(["Test Kit"]);
  kit.options1.select(0);

  expect(sheet.equipment.map((e) => e.name)).toEqual(["Test Kit", "Battleaxe"]);
});
