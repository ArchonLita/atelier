import { Register } from "../../../api/Data";
import { SRDEquipment, Weapon, toCoins } from "../../../dnd/Equipment";

@Register(SRDEquipment)
export class Battleaxe implements Weapon {
  name = "Battleaxe";
  weight = 4;
  cost = toCoins("10 gp");
  damage = 8;
}

@Register(SRDEquipment)
export class Flail implements Weapon {
  name = "Flail";
  weight = 2;
  cost = toCoins("10 gp");
  damage = 8;
}

@Register(SRDEquipment)
export class Glaive implements Weapon {
  name = "Glaive";
  weight = 6;
  cost = toCoins("20 gp");
  damage = 10;
}

export const MartialMeleeWeapons = [Battleaxe] as const;
console.log(`Registered ${SRDEquipment.size()} Weapons!`);
