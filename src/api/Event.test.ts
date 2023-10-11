import { expect, mock, test } from "bun:test";
import { Emitter, Subscribe } from "./Event";

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

  emitter.addHandler("eventA", mockHandlerA);
  emitter.addHandler("eventB", mockHandlerB);
  emitter.addHandler("eventC", mockHandlerC);

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

  emitter.addHandler("eventA", mockHandler);
  emitter.call("eventA", 39);
  emitter.removeHandler("eventA", mockHandler);
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
