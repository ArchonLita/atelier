import { expect, test } from "bun:test";
import { db, setDatabasePath } from "./Database";
import server from "./Server";
import { AddressInfo } from "net";

setDatabasePath("./test");
db.load();

await server.listen();
const addr: AddressInfo = server.server.address() as any;

async function get(endpoint: string) {
  return await fetch(`http://localhost:${addr.port}${endpoint}`);
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
