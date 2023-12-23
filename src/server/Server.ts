import Elysia from "elysia";
import { Database } from "./Database";

export class Server extends Elysia {
  constructor(db: Database) {
    super();

    this.get("/api/sheets", () => db.sheets.list());
    this.get("/api/sheets/:id", ({ params: { id } }) => db.sheets.get(id));
  }
}
