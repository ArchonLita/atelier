import { Proto } from "./api/Data";
import { Emitter } from "./api/Event";
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
export type CharacterSheetEvents = {
  load_stats: CharacterSheet;
};

export interface CharacterSheetData {
  baseAbilityScores: Record<Ability, number>;
}

export class CharacterSheet extends Emitter<CharacterSheetEvents> {
  abilityScores = construct(Abilities, 0);
  abilityModifiers = construct(Abilities, 0);
  skillScores = construct(Skills, 0);
  skillModifiers = construct(Skills, 0);

  constructor(private data: CharacterSheetData) {
    super();

    this.addListener("load_stats", this.loadStats.bind(this));
    this.call("load_stats", this);
  }

  private loadStats() {
    for (const ability of Abilities) {
      this.abilityScores[ability] = this.data.baseAbilityScores[ability];
      this.abilityModifiers[ability] = Math.floor(
        (this.abilityScores[ability] - 10) / 2,
      );

      for (const skill of AbilitySkills[ability]) {
        this.skillScores[skill] = this.abilityScores[ability];
        this.skillModifiers[skill] = Math.floor(
          (this.skillScores[skill] - 10) / 2,
        );
      }
    }
  }
}
