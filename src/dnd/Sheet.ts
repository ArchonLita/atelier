import { Property } from "../api/Data";
import { Emitter, Subscribe, createEvent } from "../api/Event";
import { construct } from "../api/Util";
import { Abilities, AbilitySkills, Skills } from "./Attributes";
import { Race } from "./Race";

// Character Sheet
export const LoadAbilityScoresEvent = createEvent<Sheet>();
export const LoadAbilityModifiersEvent = createEvent<Sheet>();
export const LoadSkillScoresEvent = createEvent<Sheet>();
export const LoadSkillModifiersEvent = createEvent<Sheet>();

export class Sheet extends Emitter {
  constructor() {
    super();

    this.addListener(this);
    this.load();
  }

  load() {
    this.call(LoadAbilityScoresEvent, this);
    this.call(LoadAbilityModifiersEvent, this);
    this.call(LoadSkillScoresEvent, this);
    this.call(LoadSkillModifiersEvent, this);
  }

  @Property
  baseAbilityScores = construct(Abilities, 0);
  abilityScores = construct(Abilities, 0);
  abilityModifiers = construct(Abilities, 0);
  skillScores = construct(Skills, 0);
  skillModifiers = construct(Skills, 0);

  @Subscribe(LoadAbilityScoresEvent)
  loadAbilityScores() {
    for (const ability of Abilities)
      this.abilityScores[ability] = this.baseAbilityScores[ability];
  }

  @Subscribe(LoadAbilityModifiersEvent)
  loadAbilityModifier() {
    for (const ability of Abilities)
      this.abilityModifiers[ability] = Math.floor(
        (this.abilityScores[ability] - 10) / 2,
      );
  }

  @Subscribe(LoadSkillScoresEvent)
  loadSkillScores() {
    for (const ability of Abilities)
      for (const skill of AbilitySkills[ability])
        this.skillScores[skill] = this.abilityScores[ability];
  }

  @Subscribe(LoadSkillModifiersEvent)
  loadSkillModifiers() {
    for (const skill of Skills)
      this.skillModifiers[skill] = Math.floor(
        (this.skillScores[skill] - 10) / 2,
      );
  }

  @Property
  feats: Feat[] = [];

  addFeat(feat: Feat) {
    this.feats.push(feat);
    this.addListener(feat);
  }

  @Property
  race?: Race;

  setRace(race: Race) {
    this.race = race;
  }
}

export interface Feat { }
