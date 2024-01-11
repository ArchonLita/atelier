import { Sheet } from "./dnd/Sheet";
import { Database, useDatabase } from "./server/Database";
import { Server } from "./server/Server";
import { loadContent } from "./Env";

await loadContent();

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

const db = new Database(process.env.DB_PATH);
useDatabase(db);
const server = new Server(db);

await db.load();
db.sheets.add(sheet);

server.listen(process.env.SERVER_PORT, ({ hostname, port }) => {
  console.log(`Server listening at ${hostname}:${port}`);
});
