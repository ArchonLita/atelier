import { CharacterData, CharacterSheet } from "./Character";
import {
  CharacterSerializer,
  FighterData,
  FighterEncoder as FighterEncoder,
} from "./classes/Fighter";

const data: CharacterData = {
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
const serializer = new CharacterSerializer();
serializer.registerEncoder(FighterEncoder);
const charClass = serializer.serialize({
  id: "fighter",
  foo: 29,
} as FighterData)!;
sheet.addCharacterClass(charClass);
console.log(sheet);
console.log(sheet.classes[0].foo());
