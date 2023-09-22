import { CharacterClass, CharacterClassData } from "../Character";
import { Decoder } from "../Util";

export interface WizardData extends CharacterClassData { }

export class Wizard extends CharacterClass { }

export const WizardDecoder: Decoder<WizardData> = {
  id: "wizard",
  construct: (data) => new Wizard(data),
};
