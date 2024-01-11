import { test } from "bun:test";
import { Scene } from "./Scene";
import { Database, useDatabase } from "../server/Database";
import { testSerialization } from "../api/Data.test";

const db = new Database(process.env.DB_PATH);
await db.load();
useDatabase(db);

test("serialize scene", () => {
  const scene = new Scene();
  scene.sheets.push(db.sheets.get("TEST-SHEET")!);

  testSerialization(scene, { sheets: ["TEST-SHEET"] }, Scene);
});
