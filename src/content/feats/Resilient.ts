import { Ability, Feat, Sheet } from "../../dnd/Sheet";
import { Subscribe } from "../../api/Event";

export class Resilient implements Feat {
  constructor(public readonly ability: Ability) {}

  @Subscribe("load_ability_scores", -10)
  onLoadStats(sheet: Sheet) {
    sheet.abilityScores[this.ability]++;
  }
}
