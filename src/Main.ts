import {
  CharacterSheetData,
  CharacterSheet,
  CharacterClassDeserializer,
} from "./Character";
import { WizardDecoder } from "./classes/Wizard";

const data: CharacterSheetData = {
  baseAbilityScores: {
    strength: 8,
    dexterity: 15,
    constitution: 13,
    intelligence: 15,
    wisdom: 12,
    charisma: 10,
  },
  classes: [],
};

const sheet = new CharacterSheet(data);

CharacterClassDeserializer.registerDecoder(WizardDecoder);
const wizard = CharacterClassDeserializer.deserialize({
  id: "wizard",
});
sheet.addCharacterClass(wizard!);
console.log(sheet);
console.log(sheet.data);
