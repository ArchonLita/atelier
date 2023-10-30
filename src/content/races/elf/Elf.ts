import { Race, Trait } from "../../../dnd/Race";

export class KeenSenses implements Trait {
  //TODO Perception Proficiency
}

export class FeyAncestry implements Trait {
  //TODO resist charm, immune magic sleep
}

export class Trance implements Trait {
  //TODO long rest duration 4h
}

export class Elf extends Race {
  constructor() {
    super();
    this.traits.push(...[]);
  }
}
