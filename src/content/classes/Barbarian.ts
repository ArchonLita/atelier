import { Class, Feature } from "../../dnd/Sheet";

export class TestFeature implements Feature {}

export class Barbarian implements Class {
  level: number = 0;
  features: Feature[] = [];

  levelUp() {
    switch (++this.level) {
      case 1:
        this.features.push(new TestFeature());
    }
  }
}
