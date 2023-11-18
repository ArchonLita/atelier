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

export const Attributes = ["speed", "armor_class", "initiative"];
export type Attribute = (typeof Attributes)[number];

type TargetMap = {
  ["ability_score"]: Ability;
  ["skill_score"]: Skill;
  ["attribute"]: Attribute;
};
export type Target = keyof TargetMap;

type Operation = (a: number, b: number) => number;
export namespace Operation {
  export const Addition: Operation = (a, b) => a + b;
}

export interface Effect<T extends Target = any> {
  type: T;
  key: TargetMap[T];
  value: number;
  apply: Operation;
}

export type EffectFilter = (effect: Effect) => boolean;

export function applyEffects(
  value: number,
  effects: Effect[],
  filter: EffectFilter,
) {
  return effects
    .filter(filter)
    .reduce(
      (acc, modifier: Effect) => modifier.apply(acc, modifier.value),
      value,
    );
}

export namespace Effects {
  const add = <T extends Target = any>(
    type: T,
    key: TargetMap[T],
    value: number,
    apply: Operation,
  ) => ({
    type,
    key,
    value,
    apply,
  });

  export const addAbilityScore = (ability: Ability, value: number) =>
    add("ability_score", ability, value, Operation.Addition);
  export const addSkillScore = (skill: Skill, value: number) =>
    add("skill_score", skill, value, Operation.Addition);
  export const addAttribute = (attribute: Attribute, value: number) =>
    add("attribute", attribute, value, Operation.Addition);

  export const filter =
    (key: any): EffectFilter =>
    (e: Effect) =>
      e.key === key;
}
