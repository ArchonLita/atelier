import { Register } from "../../../api/Data";
import { dice } from "../../../api/Dice";
import { SRDEquipment, Weapon, coin } from "../../../dnd/Equipment";

@Register(SRDEquipment)
export class Club extends Weapon {
  name = "Club";
  weight = 2;
  cost = coin("1 sp");
  damage = dice(1, 4);
}

@Register(SRDEquipment)
export class Dagger extends Weapon {
  name = "Dagger";
  weight = 1;
  cost = coin("2 gp");
  damage = dice(1, 4);
}

@Register(SRDEquipment)
export class Greatclub extends Weapon {
  name = "Greatclub";
  weight = 10;
  cost = coin("2 sp");
  damage = dice(1, 8);
}

@Register(SRDEquipment)
export class Handaxe extends Weapon {
  name = "Handaxe";
  weight = 2;
  cost = coin("5 gp");
  damage = dice(1, 6);
}

@Register(SRDEquipment)
export class Javelin extends Weapon {
  name = "Javelin";
  weight = 2;
  cost = coin("5 gp");
  damage = dice(1, 6);
}

export const SimpleMeleeWeapons = [
  Club,
  Dagger,
  Greatclub,
  Handaxe,
  Javelin,
] as const;
