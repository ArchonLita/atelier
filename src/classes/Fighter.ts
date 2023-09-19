import { CharacterClass, CharacterClassData } from "../Character";

export interface FighterData extends CharacterClassData {
  id: "fighter";
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
