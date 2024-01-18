import { Register } from "../../../api/Data";
import { dice } from "../../../api/Dice";
import { SRDEquipment, Weapon, coin } from "../../../dnd/Equipment";

@Register(SRDEquipment)
export class Battleaxe extends Weapon {
  name = "Battleaxe";
  weight = 4;
  cost = coin("10 gp");
  damage = dice(1, 8);
}

@Register(SRDEquipment)
export class Flail extends Weapon {
  name = "Flail";
  weight = 2;
  cost = coin("10 gp");
  damage = dice(1, 8);
}

@Register(SRDEquipment)
export class Glaive extends Weapon {
  name = "Glaive";
  weight = 6;
  cost = coin("20 gp");
  damage = dice(1, 10);
}

@Register(SRDEquipment)
export class Greataxe extends Weapon {
  name = "Greataxe";
  weight = 7;
  cost = coin("30 gp");
  damage = dice(1, 12);
}

export const MartialMeleeWeapons = [
  Battleaxe,
  Flail,
  Glaive,
  Greataxe,
] as const;
