import { Subscribe } from "../../../api/Event";
import { Trait, Race, LoadAbilityScoresEvent, Sheet } from "../../../dnd/Sheet";

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
    this.traits.push(new KeenSenses(), new FeyAncestry(), new Trance());
  }

  @Subscribe(LoadAbilityScoresEvent, -10)
  loadAbilityScores(sheet: Sheet) {
    sheet.abilityScores.dexterity += 2;
    sheet.speed = 30;
  }
}
