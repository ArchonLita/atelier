import { Property, TypeMap } from "../api/Data";
import { Dice, dice, roll } from "../api/Dice";
import { Emitter, Subscribe } from "../api/Event";
import { Options } from "../api/Option";
import { Split } from "../api/Util";
import { Action } from "./Action";
import { LoadActionsEvent, LoadKitEvent, LoadSheetEvent } from "./Events";
import { Sheet } from "./Sheet";

const Coins = ["cp", "sp", "ep", "gp", "pp"] as const;
type Coin = (typeof Coins)[number];

export interface Currency {
  currency: Coin;
  value: number;
}

export type CoinExp = `${number} ${Coin}`;

export function coin(str: CoinExp): Currency {
  const [num, coin] = str.split(" ") as Split<CoinExp, " ">;
  return { currency: coin, value: parseInt(num) };
}

export abstract class Equipment {
  constructor(quantity?: number) {
    this.quantity = quantity;
  }

  abstract name: string;
  abstract weight: number;
  abstract cost: Currency;

  @Property()
  quantity?: number;

  sheet?: Sheet;
  @Subscribe(LoadSheetEvent)
  loadSheet(sheet: Sheet) {
    this.sheet = sheet;
  }
}

export class WeaponAction implements Action {
  constructor(private weapon: Weapon) {}

  call(user: Sheet, target: Sheet) {
    // TODO range weapons use dexterity
    // TODO add proficiency bonus, if user has proficiency for used weapon
    const attack = roll(dice(1, 20)) + user.abilityModifiers.strength;
    // if the roll is a 20, it will always hit. if the roll is a 1, it will always miss

    if (attack >= target.armorClass) {
      const damage = roll(this.weapon.damage);
      target.hitPoints -= damage;
      console.log(
        `${user.name} -> ${target.name} (${this.weapon.name}): (${attack}) ${damage} health`,
      );
    } else {
      console.log(
        `${user.name} -> ${target.name} (${this.weapon.name}): (${attack}) missed`,
      );
    }
  }
}

export abstract class Weapon extends Equipment {
  abstract damage: Dice; // TODO add damage types
  // TODO properties

  @Subscribe(LoadActionsEvent)
  loadActions(actions: Action[]) {
    actions.push(new WeaponAction(this));
  }
}

export abstract class KitOptions extends Options<Equipment> {
  kit?: Kit;
  @Subscribe(LoadKitEvent)
  loadKit(kit: Kit) {
    this.kit = kit;
  }

  select(index: number) {
    const res = super.select(index);
    if (res) this.kit?.sheet?.equipment?.push(this.options[index]);

    return res;
  }
}

export abstract class Kit extends Equipment {
  emitter = new Emitter();

  load() {
    this.emitter.clearHandlers();
    this.emitter.addListeners(
      ...Object.values(this).filter((obj) => obj instanceof KitOptions),
    );
    this.emitter.call(LoadKitEvent, this);
  }
}

export const SRDEquipment = new TypeMap<Equipment>();
