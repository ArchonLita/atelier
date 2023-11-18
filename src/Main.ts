import { Sheet } from "./dnd/Sheet";
import { Resilient } from "./content/feats/Resilient";
import { Abilities } from "./dnd/Stats";
import { Elf } from "./content/races/elf/Elf";

const sheet = new Sheet();
sheet.baseAbilityScores = {
  strength: 8,
  dexterity: 15,
  constitution: 13,
  intelligence: 15,
  wisdom: 12,
  charisma: 10,
};
sheet.addFeat(new Resilient("intelligence"));
sheet.setRace(new Elf());
sheet.load();

console.log(sheet.feats);

console.log("-=-=- Starting Score -=-=-");
for (const ability of Abilities) {
  const score = sheet.abilityScores[ability];
  const mod = sheet.abilityModifiers[ability];
  console.log(`${ability}: ${mod >= 0 ? "+" : ""}${mod} (${score})`);
}
