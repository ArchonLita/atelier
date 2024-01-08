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
import {Race, Sheet} from './Sheet';

// Random Constructs

export interface Feat {}

export interface Feature {}

export interface Class {
  level: number;
  features: Feature[];

  levelUp: (sheet: CharacterSheet) => void;
}
// Character Sheet
export class CharacterSheet extends Sheet {
  constructor() {
    super();
  }

  @Property()
  name: string = "";

  @Property()
  feats: Feat[] = [];

  // TODO ignore multiclassing for now (magic is hard)
  @Property()
  clazz?: Class;

  load() {
    //TODO separate event calls for equipped armor and armor in inventory
    this.addListeners(this, ...this.feats);
    if (this.clazz) this.addListeners(this.clazz, ...this.clazz.features);

    this.proficiencyBonus = Math.floor((this.clazz?.level ?? 0) / 4) + 2;
    super.load();
  }

  reload() {
    this.unload();
    this.load();
  }
}
