import { expect, mock, test } from "bun:test";
import { Emitter } from "./Event";

type TestEvents = {
  eventA: number;
  eventB: string;
  eventC: undefined;
};

class TestEmitter extends Emitter<TestEvents> { }

test("listener called after event emitted", () => {
  const emitter = new TestEmitter();
  const mockHandlerA = mock(() => undefined);
  const mockHandlerB = mock(() => undefined);
  const mockHandlerC = mock(() => undefined);

  emitter.addListener("eventA", mockHandlerA);
  emitter.addListener("eventB", mockHandlerB);
  emitter.addListener("eventC", mockHandlerC);

  emitter.call("eventA", 39);
  emitter.call("eventB", "test data");
  emitter.call("eventC", undefined);

  expect(mockHandlerA.mock.calls).toEqual([[39]]);
  expect(mockHandlerB.mock.calls).toEqual([["test data"]]);
  expect(mockHandlerC.mock.calls).toEqual([[undefined]]);
});

test("listener is not called after being removed", () => {
  const emitter = new TestEmitter();
  const mockHandler = mock(() => undefined);

  emitter.addListener("eventB", mockHandler);
  emitter.call("eventB", "test data 1");
  emitter.removeListener("eventB", mockHandler);
  emitter.call("eventB", "test data 2");

  expect(mockHandler.mock.calls).toEqual([["test data 1"]]);
});
