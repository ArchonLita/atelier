import { expect, test } from "bun:test";
import { Property, deserialize, serialize } from "./Data";

class TestClass {
  @Property
  foo: number = 0;
  bar: number = 0;

  load() {
    this.bar = this.foo + 3;
  }
}

test("serializes objects from class", () => {
  const testObj = new TestClass();
  testObj.foo = 5;
  testObj.load();

  const data = serialize(testObj);
  expect(data).toEqual({ foo: 5 });

  const res = deserialize(data, TestClass);
  res.load();
  expect(res).toEqual(testObj);
});
