import { CharacterData, CharacterSheet } from "./Character";
import { Fighter } from "./classes/Fighter";

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
sheet.addCharacterClass(new Fighter({ id: "fighter", foo: 29 }));
console.log(sheet);
