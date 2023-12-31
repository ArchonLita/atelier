import { Property, TypeMap } from "../api/Data";

const Coins = ["cp", "sp", "ep", "gp", "pp"] as const;
type Coin = (typeof Coins)[number];

export interface Currency {
  currency: Coin;
  value: number;
}

function isCoin(coin: string): coin is Coin {
  return Coins.includes(coin as Coin);
}

export function toCoins(str: string): Currency {
  const [num, coin] = str.split(" ");
  if (!isCoin(coin)) throw "Invalid Coin";
  return { currency: coin, value: parseInt(num) };
}

export abstract class Equipment {
  abstract name: string;
  abstract weight: number;
  abstract cost: Currency;

  @Property()
  quantity?: number;
}

export abstract class Weapon extends Equipment {
  abstract damage: number; // TODO add damage types
  // TODO properties
}

export const SRDEquipment = new TypeMap<Equipment>();
