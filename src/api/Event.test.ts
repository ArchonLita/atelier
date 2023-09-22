import { test, mock, expect } from "bun:test";
import { Emitter } from "./Event";

test("Listener called after event emitted", () => {
  const emitter = new Emitter();
  const mockHandler = mock(() => undefined);

  emitter.addListener("test", {
    on: mockHandler,
  });
  emitter.call("test", "testData");

  expect(mockHandler.mock.calls).toEqual([["test", "testData"]]);
});
