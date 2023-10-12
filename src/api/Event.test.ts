import { expect, mock, test } from "bun:test";
import { Emitter, Subscribe } from "./Event";

type TestEvents = {
  eventA: number;
  eventB: string;
  eventC: undefined;
};

class TestEmitter extends Emitter<TestEvents> { }

test("handler called after event emitted", () => {
  const emitter = new TestEmitter();
  const mockHandlerA = mock(() => undefined);
  const mockHandlerB = mock(() => undefined);
  const mockHandlerC = mock(() => undefined);

  emitter.addMethod("eventA", mockHandlerA);
  emitter.addMethod("eventB", mockHandlerB);
  emitter.addMethod("eventC", mockHandlerC);

  emitter.call("eventA", 39);
  emitter.call("eventB", "test data");
  emitter.call("eventC", undefined);

  expect(mockHandlerA.mock.calls).toEqual([[39]]);
  expect(mockHandlerB.mock.calls).toEqual([["test data"]]);
  expect(mockHandlerC.mock.calls).toEqual([[undefined]]);
});

test("handler called based on priority, then insertion order", () => {
  const array: string[] = [];

  const emitter = new TestEmitter();
  const mockHandlerA = { method: () => array.push("a"), priority: -100 };
  const mockHandlerB = { method: () => array.push("b"), priority: 0 };
  const mockHandlerC = { method: () => array.push("c"), priority: 0 };
  const mockHandlerD = { method: () => array.push("d"), priority: 100 };

  emitter.addHandler("eventA", mockHandlerA);
  emitter.addHandler("eventA", mockHandlerB);
  emitter.addHandler("eventA", mockHandlerC);
  emitter.addHandler("eventA", mockHandlerD);
  emitter.call("eventA", 39);

  expect(array).toEqual(["d", "b", "c", "a"]);
});

test("handler is not called after being removed", () => {
  const emitter = new TestEmitter();
  const mockHandler = mock(() => undefined);

  emitter.addMethod("eventA", mockHandler);
  emitter.call("eventA", 39);
  emitter.removeMethod("eventA", mockHandler);
  emitter.call("eventA", 42);

  expect(mockHandler.mock.calls).toEqual([[39]]);
});

class TestListener {
  constructor(private fns: Function[]) { }

  @Subscribe("eventA")
  foo(num: number) {
    this.fns[0](num);
  }

  @Subscribe("eventB")
  bar(str: string) {
    this.fns[1](str);
  }

  @Subscribe("eventA")
  baz(num: number) {
    this.fns[2](num);
  }
}

test("subscribe a listener to an emitter", () => {
  const emitter = new TestEmitter();
  const handler1 = mock(() => undefined);
  const handler2 = mock(() => undefined);
  const handler3 = mock(() => undefined);

  const listener = new TestListener([handler1, handler2, handler3]);
  emitter.addListener(listener);

  emitter.call("eventA", 39);
  expect(handler1.mock.calls).toEqual([[39]]);
  expect(handler3.mock.calls).toEqual([[39]]);

  emitter.call("eventB", "test data");
  expect(handler2.mock.calls).toEqual([["test data"]]);
});
