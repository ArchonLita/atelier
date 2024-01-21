import { Property, Register, TypeMap } from "../../api/Data";
import { Subscribe } from "../../api/Event";
import { LevelUpEvent, LoadModifiersEvent } from "../../dnd/Events";
import { Options } from "../../api/Option";
import { Feature, Class } from "../../dnd/Sheet";
import { Effect, Effects, HitDice, Skill } from "../../dnd/Stats";

const BarbarianFeature = new TypeMap<Feature>();

class SkillOption extends Options<Skill> {
  count = 2;
  options = [
    "animal_handling",
    "athletics",
    "intimidation",
    "nature",
    "perception",
    "survival",
  ] as const;
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

      ...this.skills.selected
        .map((inx) => this.skills.options[inx])
        .map((skill) => Effects.addSkillProficiency(skill)),
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

@Register(BarbarianFeature)
class EquipmentFeature extends Feature {
  // TODO add "kits"
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
