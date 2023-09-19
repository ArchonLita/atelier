import { CharacterClass, CharacterClassData } from "../Character";
import { Serializer as Encoder } from "../Util";

export interface FighterData extends CharacterClassData {
  foo: number;
}

export class Fighter extends CharacterClass<FighterData> {
  constructor(data: FighterData) {
    super(data);
  }

  foo() {
    return this.data.foo;
  }
}

export type CharacterEncoder<
  T extends CharacterClass<D> = any,
  D extends CharacterClassData = any,
> = Encoder<T, D>;

export class CharacterSerializer {
  encoders = new Map<string, CharacterEncoder>();

  registerEncoder(encoder: CharacterEncoder) {
    this.encoders.set(encoder.id, encoder);
  }

  serialize<D extends CharacterClassData>(data: D): CharacterClass | undefined {
    if (!data.id) return; // missing id
    return this.encoders.get(data.id)?.construct(data);
  }
}

export const FighterEncoder: CharacterEncoder<Fighter, FighterData> = {
  id: "fighter",
  construct: (data) => new Fighter(data),
};
