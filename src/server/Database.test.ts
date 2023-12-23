import { expect, test } from "bun:test";
import { Sheet } from "../dnd/Sheet";
import { Database } from "./Database";
import { Glob } from "bun";

const db = new Database(process.env.DB_PATH);

const baseAbilityScores = {
  strength: 8,
  wisdom: 10,
  charisma: 12,
  dexterity: 13,
  constitution: 14,
  intelligence: 15,
};

const id = "TEST-SHEET";

test("Writes sheets to file database", async () => {
  const sheet = new Sheet();
  sheet.baseAbilityScores = baseAbilityScores;
  sheet.load();

  db.sheets.set(id, sheet);

  await db.save();
  await db.load();

  expect(db.sheets.get(id)).toEqual(sheet);

  const files = await Array.fromAsync(new Glob("*.json").scan("./test/sheets"));
  expect(files).toEqual(["TEST-SHEET.json"]);
});
