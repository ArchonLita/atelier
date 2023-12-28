import { Register } from "../../../api/Data";
import { Subscribe } from "../../../api/Event";
import { Equipment, SRDEquipment, toCoins } from "../../../dnd/Equipment";
import { LoadModifiersEvent } from "../../../dnd/Sheet";
import { Effect, Effects } from "../../../dnd/Stats";

@Register(SRDEquipment)
export class PaddedArmor implements Equipment {
  name = "Padded Armor";
  cost = toCoins("5 gp");
  weight = 8;

  // TODO redo event order
  // @Subscribe(LoadModifiersEvent)
  // loadModifiers(effects: Effect[]) {
  //   // TODO add dex modifier from sheet
  //   effects.push(Effects.setAttribute("armor_class", 11));
  // }
}
