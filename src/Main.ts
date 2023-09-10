import { CharacterData, CharacterSheet } from "./Character";

const data: CharacterData = {
  baseAbilityScores: {
    strength: 8,
    dexterity: 15,
    constitution: 13,
    intelligence: 15,
    wisdom: 12,
    charisma: 10,
  },
};

const sheet = new CharacterSheet(data);
console.log(sheet);
