import { Property } from "../../api/Data";
import { Subscribe } from "../../api/Event";
import { Class, Feature, LoadModifiersEvent, Sheet } from "../../dnd/Sheet";
import { Effect, Effects, HitDice } from "../../dnd/Stats";

export class TestFeature implements Feature {}

export class Barbarian implements Class {
  @Property()
  level: number = 0;

  //TODO serialize subclass
  @Property()
  features: Feature[] = [];

  @Property()
  hitDice: HitDice[] = [];

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
  }
}
