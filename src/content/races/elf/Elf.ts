import { Subscribe } from "../../../api/Event";
import { LoadModifiersEvent, Race, Trait } from "../../../dnd/Sheet";
import { Effect, Effects } from "../../../dnd/Stats";

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

  @Subscribe(LoadModifiersEvent)
  loadModifiers(modifiers: Effect[]) {
    modifiers.push(
      Effects.addAbilityScore("dexterity", 2),
      Effects.addAttribute("speed", 30),
    );
  }
}
