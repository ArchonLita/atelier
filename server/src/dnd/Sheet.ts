import { Property } from "../api/Data";
import { Emitter, Subscribe } from "../api/Event";
import { construct } from "../api/Util";
import { Action } from "./Action";
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

export interface Trait {}

export interface Race {
  traits: Trait[];
}

// Sheet
export abstract class Sheet extends Emitter {
  @Property()
  name: string = "";

  load() {
    if (this.race) this.addListeners(this.race, ...this.race.traits);

    this.loadBaseAbilityScores();
    this.call(LoadModifiersEvent, this.modifiers);
    this.loadAttributes();
    this.call(LoadActionsEvent, this.actions);
  }

  unload() {
    this.clearHandlers();
    this.modifiers = [];
    this.actions = [];
  }

  reload() {
    // Reload should be called after prop changes.
    this.unload();
    this.load();
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

  // TODO register all races here
  @Property()
  race?: Race;

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
