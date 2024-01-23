import { Property } from "../api/Data";
import { Equipment, SRDEquipment } from "./Equipment";
import { Sheet } from "./Sheet";

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

  @Property(SRDEquipment)
  equipment: Equipment[] = [];

  @Property(SRDEquipment)
  armor?: Equipment;

  load() {
    //TODO separate event calls for equipped armor and armor in inventory
    if (this.armor) this.addListener(this.armor);

    this.addListeners(this, ...this.feats);
    if (this.clazz) this.addListeners(this.clazz, ...this.clazz.features);

    this.proficiencyBonus = Math.floor((this.clazz?.level ?? 0) / 4) + 2;
    this.addListeners(...this.equipment);
    super.load();
  }

  reload() {
    this.unload();
    this.load();
  }
}
