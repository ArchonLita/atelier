import {
  CharacterClassDeserializer,
  CharacterSheet,
  CharacterSheetData,
} from "./Character";
import { Wizard } from "./classes/Wizard";

CharacterClassDeserializer.registerDecoder(Wizard);

const data: CharacterSheetData = {
  baseAbilityScores: {
    strength: 8,
    dexterity: 15,
    constitution: 13,
    intelligence: 15,
    wisdom: 12,
    charisma: 10,
  },
  classes: [
    {
      id: "wizard",
      features: [{ id: "a" }, { id: "b" }],
    },
  ],
};

const sheet = new CharacterSheet(data);
console.log(sheet);
