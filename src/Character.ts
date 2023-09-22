import { Data, Deserializer, Logic, construct, notEmpty } from "./Util";

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

export interface CharacterClassData extends Data {
  features: FeatureData[];
}

export abstract class CharacterClass extends Logic<CharacterClassData> {
  features: Feature[] = [];

  abstract buildFeature(data: FeatureData): Feature | undefined;

  constructor(data: CharacterClassData) {
    super(data);

    data.features
      .map((data) => this.buildFeature(data))
      .filter(notEmpty)
      .forEach((feature) => this.features.push(feature));
  }
}

export const CharacterClassDeserializer = new Deserializer<
  CharacterClassData,
  CharacterClass
>();

export interface FeatureData extends Data { }
export abstract class Feature extends Logic<FeatureData> { }
export class FeatureDeserializer extends Deserializer<FeatureData, Feature> { }

export interface CharacterSheetData extends Data {
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

  addClass(data: CharacterClassData) {
    const characterClass = CharacterClassDeserializer.deserialize(data);
    if (characterClass) this.classes.push(characterClass);
  }

  constructor(public readonly data: CharacterSheetData) {
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

    data.classes.forEach(this.addClass.bind(this));
  }
}
