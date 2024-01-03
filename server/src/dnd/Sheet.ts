import { Property } from "../api/Data";
import { Emitter, Subscribe } from "../api/Event";
import { construct } from "../api/Util";
import { Action } from "./Action";
import { Equipment, SRDEquipment } from "./Equipment";
import { LoadModifiersEvent, LoadActionsEvent } from "./Events";
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

  levelUp: (sheet: Sheet) => void;
}

// Character Sheet
export class Sheet extends Emitter {
  constructor() {
    super();

    this.load();
  }

  @Property()
  name: string = "";

  load() {
    this.clearHandlers();
    this.modifiers = [];
    this.actions = [];

    //TODO separate event calls for equipped armor and armor in inventory
    this.addListeners(this, ...this.feats);
    if (this.race) this.addListeners(this.race, ...this.race.traits);
    if (this.clazz) this.addListeners(this.clazz, ...this.clazz.features);
    if (this.armor) this.addListener(this.armor);

    this.proficiencyBonus = Math.floor((this.clazz?.level ?? 0) / 4) + 2;

    this.loadBaseAbilityScores();
    this.call(LoadModifiersEvent, this.modifiers);
    this.loadAttributes();
    this.addListeners(...this.equipment);
    this.call(LoadActionsEvent, this.actions);
  }

  @Property()
  baseAbilityScores = construct(Abilities, 0);

  abilityScores = construct(Abilities, 0);
  abilityModifiers = construct(Abilities, 0);
  savingModifiers = construct(Abilities, 0);
  savingProficiencies = construct(Abilities, false);
  skillModifiers = construct(Skills, 0);
  skillProficiencies = construct(Skills, false);

  proficiencyBonus: number = 0;

  speed = 0;
  armorClass = 0;

  @Property()
  hitPoints: number = 0;
  maxHitPoints: number = 0;

  modifiers: Effect[] = [];

  actions: Action[] = [];

  @Subscribe(LoadModifiersEvent, -100)
  loadModifiers(modifiers: Effect[]) {
    this.modifiers = modifiers;
  }

  @Subscribe(LoadActionsEvent, -100)
  loadActions(actions: Action[]) {
    this.actions = actions;
  }

  loadBaseAbilityScores() {
    this.modifiers.push(
      ...Abilities.map((ability) =>
        Effects.addAbilityScore(ability, this.baseAbilityScores[ability]),
      ),
    );
  }

  loadAttributes() {
    for (const ability of Abilities) {
      this.abilityScores[ability] = applyEffects(
        0,
        this.modifiers,
        Effects.filter("ability_score", ability),
      );

      this.abilityModifiers[ability] = Math.floor(
        (this.abilityScores[ability] - 10) / 2,
      );

      this.savingProficiencies[ability] = !!applyEffects(
        0,
        this.modifiers,
        Effects.filter("saving_proficiency", ability),
      );

      this.savingModifiers[ability] =
        this.abilityModifiers[ability] +
        (this.savingProficiencies[ability] ? this.proficiencyBonus : 0);
    }

    for (const ability of Abilities) {
      for (const skill of AbilitySkills[ability]) {
        this.skillProficiencies[skill] = !!applyEffects(
          0,
          this.modifiers,
          Effects.filter("skill_proficiency", skill),
        );

        this.skillModifiers[skill] =
          this.abilityModifiers[ability] +
          (this.skillProficiencies[skill] ? this.proficiencyBonus : 0);
      }
    }

    this.maxHitPoints = applyEffects(
      0,
      this.modifiers,
      Effects.filter("attribute", "max_hit_points"),
    );

    this.speed = applyEffects(
      0,
      this.modifiers,
      Effects.filter("attribute", "speed"),
    );

    this.armorClass = applyEffects(
      10 + this.abilityModifiers.dexterity,
      this.modifiers,
      Effects.filter("attribute", "armor_class"),
    );
  }

  @Property()
  feats: Feat[] = [];

  // TODO register all races here
  @Property()
  race?: Race;

  // TODO ignore multiclassing for now (magic is hard)
  @Property()
  clazz?: Class;

  @Property(SRDEquipment)
  equipment: Equipment[] = [];

  @Property(SRDEquipment)
  armor?: Equipment;

  displayInformation() {
    console.log(`-=-=- ${this.name} -=-=-`);

    console.log("-=-=- Abilities -=-=-");
    for (const ability of Abilities) {
      const mod = this.abilityModifiers[ability];
      const modSign = mod > 0 ? "+" : "";
      const score = this.abilityScores[ability];
      console.log(`${ability}: ${modSign}${mod} (${score})`);
    }

    console.log("-=-=- Saving -=-=-");
    for (const ability of Abilities) {
      const mod = this.savingModifiers[ability];
      const modSign = mod > 0 ? "+" : "";
      const prof = this.savingProficiencies[ability] ? "x" : " ";
      console.log(`${ability}: ${modSign}${mod} [${prof}]`);
    }

    console.log("-=-=- Skills -=-=-");
    for (const skill of Skills) {
      const mod = this.skillModifiers[skill];
      const modSign = mod > 0 ? "+" : "";
      const prof = this.skillProficiencies[skill] ? "x" : " ";
      console.log(`${skill}: ${modSign}${mod} [${prof}]`);
    }
  }
}
