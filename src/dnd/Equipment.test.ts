import { test } from "bun:test";
import { PaddedArmor } from "../content/equipment/weapons/Armor";
import { Property, serialize } from "../api/Data";
import { Equipment, SRDEquipment } from "./Equipment";
import { testSerialization } from "../api/Data.test";
import { SheetWithBaseScores } from "../content/test/TestCharacters.test";

class TestInventory {
  @Property(SRDEquipment)
  equipment: Equipment[] = [];
}

test("serialize equipment", () => {
  const inventory = new TestInventory();
  inventory.equipment.push(new PaddedArmor());
  const data = {
    equipment: [
      {
        _id: "PaddedArmor",
      },
    ],
  };

  testSerialization(inventory, data, TestInventory);
});

test("apply equipment effects", () => {
  const sheet = SheetWithBaseScores();
  sheet.equipment.push(new PaddedArmor());

  console.log(serialize(sheet));
});
