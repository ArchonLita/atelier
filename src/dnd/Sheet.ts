import { Property } from "../api/Data";
import { Emitter, Subscribe, createEvent } from "../api/Event";
import { construct } from "../api/Util";
import {
  Abilities,
  AbilitySkills,
  Effect,
  Effects,
  Skills,
  applyEffects,
} from "./Stats";

// Random Constructs

export interface Feat {}

export interface Trait {}

export interface Race {
  traits: Trait[];
}

export interface Feature {}

export interface Class {
  level: number;
  features: Feature[];

  levelUp: () => void;
}

// Character Sheet
export const LoadAbilityScoresEvent = createEvent<Sheet>();
export const LoadAbilityModifiersEvent = createEvent<Sheet>();
export const LoadSkillScoresEvent = createEvent<Sheet>();
export const LoadSkillModifiersEvent = createEvent<Sheet>();

export const LoadModifiersEvent = createEvent<Effect[]>();

export class Sheet extends Emitter {
  constructor() {
    super();

    this.load();
  }

  load() {
    this.clearHandlers();
    this.addListeners(this, ...this.feats);
    if (this.race) this.addListeners(this.race, ...this.race.traits);
    if (this.clazz) this.addListeners(this.clazz, ...this.clazz.features);

    this.loadBaseAbilityScores();
    this.call(LoadModifiersEvent, this.modifiers);
    this.loadAttributes();
  }

  @Property()
  baseAbilityScores = construct(Abilities, 0);

  abilityScores = construct(Abilities, 0);
  abilityModifiers = construct(Abilities, 0);
  skillScores = construct(Skills, 0);
  skillModifiers = construct(Skills, 0);

  speed = 0;

  modifiers: Effect[] = [];

  @Subscribe(LoadModifiersEvent, -100)
  loadModifiers(modifiers: Effect[]) {
    this.modifiers = modifiers;
  }

  loadBaseAbilityScores() {
    for (const ability of Abilities) {
      this.modifiers.push(
        Effects.addAbilityScore(ability, this.baseAbilityScores[ability]),
      );
    }
  }

  loadAttributes() {
    for (const ability of Abilities) {
      this.abilityScores[ability] = applyEffects(
        0,
        this.modifiers,
        Effects.filter(ability),
      );

      this.abilityModifiers[ability] = Math.floor(
        (this.abilityScores[ability] - 10) / 2,
      );
    }
    for (const ability of Abilities) {
      for (const skill of AbilitySkills[ability]) {
        this.skillScores[skill] = applyEffects(
          this.abilityScores[ability],
          this.modifiers,
          Effects.filter(skill),
        );

        this.skillModifiers[skill] = Math.floor(
          (this.skillScores[skill] - 10) / 2,
        );
      }
    }

    this.speed = applyEffects(0, this.modifiers, Effects.filter("speed"));
  }

  @Property()
  feats: Feat[] = [];

  // TODO register all races here
  @Property()
  race?: Race;

  // TODO ignore multiclassing for now (magic is hard)
  @Property()
  clazz?: Class;
}
