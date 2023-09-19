import { construct } from "./Util";

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

export interface CharacterData {
  baseAbilityScores: {
    [key in Ability]: number;
  };
  classes: CharacterClassData[];
}

export class CharacterSheet {
  abilityScores = construct(Abilities, 0);
  abilityModifiers = construct(Abilities, 0);
  skillScores = construct(Skills, 0);
  skillModifiers = construct(Skills, 0);

  classes: CharacterClass[] = [];

  addCharacterClass(characterClass: CharacterClass) {
    this.data.classes.push(characterClass.data);
    this.classes.push(characterClass);
  }

  constructor(private data: CharacterData) {
    for (const ability of Abilities) {
      this.abilityScores[ability] = data.baseAbilityScores[ability];
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

export interface CharacterClassData {
  id: string;
}

export abstract class CharacterClass<
  T extends CharacterClassData = CharacterClassData,
> {
  public readonly data: T;

  constructor(data: T) {
    this.data = data;
  }

  abstract foo(): number;
}
