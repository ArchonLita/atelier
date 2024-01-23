import { Subscribe } from "../../api/Event";
import { LoadModifiersEvent } from "../../dnd/Events";
import { MonsterSheet } from "../../dnd/MonsterSheet";
import { Effect, Effects } from "../../dnd/Stats";

export class Wolf extends MonsterSheet {
  // todo: undo hardcoding and move baseline info into a config file
  constructor() {
    super();
    this.challengeRating = 0.25;
    this.baseAbilityScores = {
      strength: 12,
      dexterity: 15,
      constitution: 12,
      intelligence: 3,
      wisdom: 12,
      charisma: 6,
    };
    this.tags.add("beast");
    this.tags.add("unaligned");
  }

  load() {
    this.modifiers.push(
      Effects.setAttribute("armor_class", 13),
      Effects.setAttribute("speed", 40),
      Effects.addSkillProficiency("perception"),
      Effects.addSkillProficiency("stealth"),
    );
    super.load();
  }
}
