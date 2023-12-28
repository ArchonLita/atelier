import { Glob } from "bun";

declare module "bun" {
  interface Env {
    DB_PATH: string;

    SERVER_PORT: number;
  }
}

export async function loadContent() {
  const files = (
    await Array.fromAsync(
      new Glob("**/*.ts").scan(import.meta.dir + "/content"),
    )
  ).filter((file) => !file.includes(".test"));
  files.forEach((file) => console.log(`Loading: ${file}`));
  files.map((file) => `./content/${file}`).forEach((file) => require(file));
}
