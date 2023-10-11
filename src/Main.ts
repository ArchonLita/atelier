import { Abilities, Sheet } from "./Sheet";

const sheet = new Sheet();
sheet.baseAbilityScores = {
  strength: 8,
  dexterity: 15,
  constitution: 13,
  intelligence: 15,
  wisdom: 12,
  charisma: 10,
};
sheet.load();

console.log("-=-=- Starting Score -=-=-");
for (const ability of Abilities) {
  const score = sheet.abilityScores[ability];
  const mod = sheet.abilityModifiers[ability];
  console.log(`${ability}: ${mod >= 0 ? "+" : ""}${mod} (${score})`);
}
