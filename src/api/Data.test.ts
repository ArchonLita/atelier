import { expect, test } from "bun:test";
import { Property, deserialize, serialize } from "./Data";

export function testSerialization<T>(obj: T, data: any, ctor: Constructor<T>) {
  const ser = serialize(obj);
  expect(ser).toEqual(data);

  const res = deserialize(ser, ctor);
  expect(res).toEqual(obj);
}

class TestClass {
  @Property()
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

  const data = { foo: 5 };

  testSerialization(testObj, data, TestClass);
});

class TestWrapper {
  @Property(TestClass)
  data: TestClass;
  foo: number;
  bar: number;

  load() {
    this.foo = this.data.foo;
    this.bar = this.data.bar;
  }
}

test("serialize nested objects", () => {
  const testObj = new TestClass();
  testObj.foo = 5;
  testObj.load();

  const testWrapper = new TestWrapper();
  testWrapper.data = testObj;
  testWrapper.load();

  const data = { data: { foo: 5 } };
  testSerialization(testWrapper, data, TestWrapper);
});
