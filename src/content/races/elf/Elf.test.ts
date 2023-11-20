import { expect, test } from "bun:test";
import { Sheet } from "../../../dnd/Sheet";
import { Elf } from "./Elf";
import { deserialize, serialize } from "../../../api/Data";

const baseAbilityScores = {
  strength: 8,
  dexterity: 15,
  constitution: 13,
  intelligence: 15,
  wisdom: 12,
  charisma: 10,
};

test("create elf", () => {
  const sheet = new Sheet();
  sheet.baseAbilityScores = baseAbilityScores;
  sheet.setRace(new Elf());
  sheet.load();

  expect(sheet.speed).toEqual(30);
  expect(sheet.abilityScores.dexterity).toEqual(
    sheet.baseAbilityScores.dexterity + 2,
  );
});

test("serialize elf", () => {
  const elf = new Elf();
  const data = serialize(elf);
  console.log(data);

  const res = deserialize(data, Elf);
  console.log(res);
});
