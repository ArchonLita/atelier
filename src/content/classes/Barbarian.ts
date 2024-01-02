import { Property } from "../../api/Data";
import { Subscribe } from "../../api/Event";
import { LoadModifiersEvent } from "../../dnd/Events";
import { Options } from "../../dnd/Option";
import { Feature, Class, Sheet } from "../../dnd/Sheet";
import { Effect, Effects, HitDice, Skill } from "../../dnd/Stats";

export class TestFeature implements Feature {}

class ProficiencyOption extends Options<Skill> {
  getOptions(): Skill[] {
    return [
      "animal_handling",
      "athletics",
      "intimidation",
      "nature",
      "perception",
      "survival",
    ];
  }
}

// TODO equipment selection

export class Barbarian implements Class {
  @Property()
  level: number = 0;

  //TODO serialize subclass
  @Property()
  features: Feature[] = [];

  @Property()
  hitDice: HitDice[] = [];

  @Property(ProficiencyOption)
  skillProficiencies = new ProficiencyOption();
  //TODO equipment proficiency + starting equipment

  levelUp(sheet: Sheet) {
    switch (++this.level) {
      case 1:
        this.features.push(new TestFeature());
    }

    sheet.load();

    this.hitDice.push({
      value: 12,
      hitPoints:
        this.level === 1
          ? 12 + sheet.abilityModifiers.constitution
          : 7 + sheet.abilityModifiers.constitution,
    });
  }

  @Subscribe(LoadModifiersEvent)
  loadModifiers(modifiers: Effect[]) {
    const hitPoints = this.hitDice
      .map((dice) => dice.hitPoints)
      .reduce((acc, val) => acc + val, 0);
    modifiers.push(Effects.addAttribute("max_hit_points", hitPoints));

    // Proficiencies
    modifiers.push(
      Effects.addAbilityProficiency("strength"),
      Effects.addAbilityProficiency("constitution"),
      ...this.skillProficiencies.selected
        .map((inx) => this.skillProficiencies.getOptions()[inx])
        .map((skill) => Effects.addSkillProficiency(skill)),
    );
  }
}
