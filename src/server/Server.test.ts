import { expect, test } from "bun:test";
import { Database } from "./Database";
import { App } from "./Server";

const db = new Database("./test");
const app = new App(db);

await db.load();

async function get(endpoint: string) {
  const req = new Request(`http://localhost${endpoint}`);
  return await app.handle(req);
}

test("Lists character sheets", async () => {
  const response = await get("/api/sheets");
  const data = await response.json();
  expect(data).toEqual(["TEST-SHEET"]);
});

test("Gets character sheet", async () => {
  const response = await get("/api/sheets/TEST-SHEET");
  expect(response.status).toEqual(200);
});
