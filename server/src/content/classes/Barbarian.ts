import { Property, Register, TypeMap } from "../../api/Data";
import { Subscribe } from "../../api/Event";
import { LevelUpEvent, LoadModifiersEvent } from "../../dnd/Events";
import { Options } from "../../api/Option";
import { Feature, Class } from "../../dnd/Sheet";
import { Effect, Effects, HitDice, Skill } from "../../dnd/Stats";
import { Equipment, SRDEquipment } from "../../dnd/Equipment";
import {
  AnyMartialMeleeWeapon,
  Greataxe,
} from "../equipment/weapons/MartialMelee";
import {
  AnySimpleMeleeWeapon,
  Handaxe,
  Javelin,
} from "../equipment/weapons/SimpleMelee";

const BarbarianFeature = new TypeMap<Feature>();

class SkillOption extends Options<Skill> {
  model = {
    count: 2,
    options: [
      "animal_handling",
      "athletics",
      "intimidation",
      "nature",
      "perception",
      "survival",
    ] as Skill[],
  };
}

@Register(BarbarianFeature)
export class ProficiencyFeature extends Feature {
  @Property(SkillOption)
  skills = new SkillOption();

  @Subscribe(LoadModifiersEvent)
  loadModifiers(modifiers: Effect[]) {
    modifiers.push(
      Effects.addAbilityProficiency("strength"),
      Effects.addAbilityProficiency("constitution"),

      ...this.skills.selected.map((skill) =>
        Effects.addSkillProficiency(skill),
      ),
    );
  }
}

@Register(BarbarianFeature)
class HitPointsFeature extends Feature {
  @Property()
  hitDice: HitDice[] = [];

  @Subscribe(LevelUpEvent)
  levelUp() {
    this.hitDice.push({
      value: 12,
      hitPoints:
        this.clazz?.level === 1
          ? 12 + (this.sheet?.abilityModifiers.constitution ?? 0)
          : 7 + (this.sheet?.abilityModifiers.constitution ?? 0),
    });
  }

  @Subscribe(LoadModifiersEvent)
  loadModifiers(modifiers: Effect[]) {
    const hitPoints = this.hitDice
      .map((dice) => dice.hitPoints)
      .reduce((acc, val) => acc + val, 0);

    modifiers.push(Effects.addAttribute("max_hit_points", hitPoints));
  }
}

class BarbarianEquipment extends Options<Equipment> {
  @Property(SRDEquipment)
  selected: Equipment[] = [];

  model = {
    count: 3,
    options: [
      {
        count: 1,
        options: [new Greataxe(), AnyMartialMeleeWeapon()],
      },

      {
        count: 1,
        options: [new Handaxe(2), AnySimpleMeleeWeapon()],
      },

      //TODO add explorer's pack
      {
        count: 1,
        options: [new Javelin(4)],
      },
    ],
  };
}

@Register(BarbarianFeature)
export class EquipmentFeature extends Feature {
  options = new BarbarianEquipment();

  @Property()
  claimed: boolean = false;

  claim() {
    if (this.claimed) return;
    if (this.options.selected.length !== 0) {
      this.sheet?.equipment.push(...this.options.selected);
      this.claimed = true;
    }
  }
}

@Register(BarbarianFeature)
export class TestFeature extends Feature {}

export class Barbarian extends Class {
  @Property()
  level: number = 0;

  @Property(BarbarianFeature)
  features: Feature[] = [
    new HitPointsFeature(),
    new ProficiencyFeature(),
    new EquipmentFeature(),
  ];

  levelUp() {
    this.level++;
    this.call(LevelUpEvent);

    switch (this.level) {
      case 1:
        this.features.push(new TestFeature());
    }

    this.load();
    this.sheet?.load();
  }
}
