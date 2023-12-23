import { Sheet } from "./dnd/Sheet";
import { db } from "./server/Database";
import Server from "./server/Server";

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

db.load();

Server.listen(8080, ({ hostname, port }) => {
  console.log(`Server listening at ${hostname}:${port}`);
});
