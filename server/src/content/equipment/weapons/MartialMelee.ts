import { Register } from "../../../api/Data";
import { SRDEquipment, Weapon, toCoins } from "../../../dnd/Equipment";

@Register(SRDEquipment)
export class Battleaxe extends Weapon {
  name = "Battleaxe";
  weight = 4;
  cost = toCoins("10 gp");
  damage = 8;
}

@Register(SRDEquipment)
export class Flail extends Weapon {
  name = "Flail";
  weight = 2;
  cost = toCoins("10 gp");
  damage = 8;
}

@Register(SRDEquipment)
export class Glaive extends Weapon {
  name = "Glaive";
  weight = 6;
  cost = toCoins("20 gp");
  damage = 10;
}

export const MartialMeleeWeapons = [Battleaxe, Flail, Glaive] as const;
