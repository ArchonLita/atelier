declare module "bun" {
  interface Env {
    DB_PATH: string;

    SERVER_PORT: number;
  }
}
