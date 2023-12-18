import fastify from "fastify";
import { db } from "./Database";

const server = fastify();

server.get("/api/sheets", (_, reply) => {
  reply.send(db.sheets.list());
});

server.get("/api/sheets/:id", (request, reply) => {
  const { id } = request.params as any;
  reply.send(db.sheets.get(id));
});

export default server;
