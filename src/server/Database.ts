import { Constructor, deserialize, serialize } from "../api/Data";
import { Sheet } from "../dnd/Sheet";
import { Optional, generateDir } from "../api/Util";
import { readFile, readdir } from "fs/promises";

export class Schema<T> {
  private data: Record<string, T> = {};

  constructor(
    public readonly path: string,
    public readonly dataType: Constructor<T>,
  ) {}

  get(id: string): Optional<T> {
    return this.data[id];
  }

  set(id: string, obj: T): Optional<T> {
    const old = this.data[id];
    this.data[id] = obj;
    return old;
  }

  add(obj: T): string {
    const id = crypto.randomUUID();
    this.data[id] = obj;
    return id;
  }

  list(): string[] {
    return Object.keys(this.data);
  }

  async save() {
    await generateDir(this.path);
    await Promise.all(
      Object.entries(this.data).map(([k, v]) =>
        Bun.write(
          `${this.path}/${k}.json`,
          JSON.stringify(serialize(v), null, 2),
        ),
      ),
    );
  }

  async load() {
    await generateDir(this.path);
    for (const file of await readdir(this.path)) {
      const data = JSON.parse(
        (await readFile(`${this.path}/${file}`)).toString(),
      );
      const id = file.split(".")[0];
      this.data[id] = deserialize(data, this.dataType);
    }
  }
}

export class Database {
  public readonly sheets;

  constructor(public readonly path: string) {
    this.sheets = new Schema(`${path}/sheets`, Sheet);
  }

  async load() {
    await generateDir(this.path);
    this.sheets.load();
  }

  async save() {
    await generateDir(this.path);
    this.sheets.save();
  }
}

export let db = new Database("./data");
await db.load();

export async function setDatabasePath(path: string) {
  db = new Database(path);
  await db.load();
}
