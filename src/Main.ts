import { Abilities, CharacterSheet } from "./Character";

const char = new CharacterSheet();
char.baseAbilityScores = {
  strength: 8,
  dexterity: 15,
  constitution: 13,
  intelligence: 15,
  wisdom: 12,
  charisma: 10,
};
char.load();

console.log("-=-=- Starting Score -=-=-");
for (const ability of Abilities) {
  const score = char.abilityScores[ability];
  const mod = char.abilityModifiers[ability];
  console.log(`${ability}: ${mod >= 0 ? "+" : ""}${mod} (${score})`);
}
