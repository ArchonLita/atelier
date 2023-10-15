import { Property } from "./api/Data";
import { Emitter, Subscribe } from "./api/Event";
import { construct } from "./api/Util";

// Stats
export const Abilities = [
  "strength",
  "dexterity",
  "intelligence",
  "wisdom",
  "charisma",
  "constitution",
] as const;
export type Ability = (typeof Abilities)[number];

export const Skills = [
  "acrobatics",
  "animal_handling",
  "arcana",
  "athletics",
  "deception",
  "history",
  "insight",
  "intimidation",
  "investigation",
  "medicine",
  "nature",
  "perception",
  "performance",
  "persuasion",
  "religion",
  "sleight_of_hand",
  "stealth",
  "survival",
] as const;
export type Skill = (typeof Skills)[number];

export const AbilitySkills: {
  [key in Ability]: Skill[];
} = {
  strength: ["athletics"],
  dexterity: ["acrobatics", "sleight_of_hand", "stealth"],
  constitution: [],
  intelligence: ["arcana", "history", "investigation", "nature", "religion"],
  wisdom: ["animal_handling", "insight", "medicine", "perception", "survival"],
  charisma: ["deception", "intimidation", "performance", "persuasion"],
};

// Character Sheet
export type SheetEvents = {
  load_ability_scores: Sheet;
  load_ability_modifier: Sheet;
  load_skill_scores: Sheet;
  load_skill_modifier: Sheet;
};

export class Sheet extends Emitter<SheetEvents> {
  constructor() {
    super();

    this.addListener(this);
    this.load();
  }

  load() {
    this.call("load_ability_scores", this);
    this.call("load_ability_modifier", this);
    this.call("load_skill_scores", this);
    this.call("load_skill_modifier", this);
  }

  @Property
  baseAbilityScores = construct(Abilities, 0);
  abilityScores = construct(Abilities, 0);
  abilityModifiers = construct(Abilities, 0);
  skillScores = construct(Skills, 0);
  skillModifiers = construct(Skills, 0);

  @Subscribe("load_ability_scores")
  loadAbilityScores() {
    for (const ability of Abilities)
      this.abilityScores[ability] = this.baseAbilityScores[ability];
  }

  @Subscribe("load_ability_modifier")
  loadAbilityModifier() {
    for (const ability of Abilities)
      this.abilityModifiers[ability] = Math.floor(
        (this.abilityScores[ability] - 10) / 2,
      );
  }

  @Subscribe("load_skill_scores")
  loadSkillScores() {
    for (const ability of Abilities)
      for (const skill of AbilitySkills[ability])
        this.skillScores[skill] = this.abilityScores[ability];
  }

  @Subscribe("load_skill_modifier")
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
}

export interface Feat { }
