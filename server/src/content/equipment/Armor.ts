import { Register } from "../../api/Data";
import { Subscribe } from "../../api/Event";
import { SRDEquipment, Equipment, coin } from "../../dnd/Equipment";
import { LoadModifiersEvent } from "../../dnd/Events";
import { Effect, Effects } from "../../dnd/Stats";

@Register(SRDEquipment)
export class PaddedArmor extends Equipment {
  name = "Padded armor";
  cost = coin("5 gp");
  weight = 8;

  @Subscribe(LoadModifiersEvent)
  loadModifiers(effects: Effect[]) {
    effects.push(Effects.addAttribute("armor_class", 1));
  }
}

@Register(SRDEquipment)
export class LeatherArmor extends Equipment {
  name = "Leather armor";
  cost = coin("10 gp");
  weight = 10;

  @Subscribe(LoadModifiersEvent)
  loadModifiers(effects: Effect[]) {
    effects.push(Effects.addAttribute("armor_class", 1));
  }
}

@Register(SRDEquipment)
export class StuddedLeatherArmor extends Equipment {
  name = "Studded leather armor";
  cost = coin("45 gp");
  weight = 13;

  @Subscribe(LoadModifiersEvent)
  loadModifiers(effects: Effect[]) {
    effects.push(Effects.addAttribute("armor_class", 2));
  }
}
