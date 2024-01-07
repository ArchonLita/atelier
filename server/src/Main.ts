import { CharacterSheet } from "./dnd/CharacterSheet";
import { Database } from "./server/Database";
import { Server } from "./server/Server";
import { loadContent } from "./Env";

await loadContent();

const sheet = new CharacterSheet();
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
const server = new Server(db);

await db.load();
server.listen(process.env.SERVER_PORT, ({ hostname, port }) => {
  console.log(`Server listening at ${hostname}:${port}`);
});
