import { Subscribe } from "../../api/Event";
import { Feat, LoadModifiersEvent } from "../../dnd/Sheet";
import { Ability, Effect, Effects } from "../../dnd/Stats";

export class Resilient implements Feat {
  constructor(public readonly ability: Ability) {}

  @Subscribe(LoadModifiersEvent)
  onLoadStats(modifiers: Effect[]) {
    modifiers.push(Effects.addAbilityProficiency(this.ability));
  }
}
