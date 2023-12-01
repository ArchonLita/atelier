import { expect, test } from "bun:test";
import { Constructor, Property, deserialize, serialize } from "./Data";
import { Loadable } from "./Util";
import { TestSubclass1 as DuplicateSubclass } from "./Data2.test";

export function testSerialization<T>(obj: T, data: any, ctor: Constructor<T>) {
  const ser = serialize(obj);
  expect(ser).toEqual(data);

  const res = deserialize(ser, ctor);
  expect(res).toEqual(obj);
}

class TestClass implements Loadable {
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

class TestWrapper implements Loadable {
  @Property(TestClass)
  data?: TestClass;
  foo?: number;
  bar?: number;

  load() {
    this.foo = this.data?.foo;
    this.bar = this.data?.bar;
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

class TestSubclass1 {
  @Property()
  foo?: number;
}

class TestSubclass2 {
  @Property()
  bar?: string;
}

class TestSubclass3 {
  @Property()
  baz?: object;
}

const Subclasses = [
  TestSubclass1,
  TestSubclass2,
  TestSubclass3,
  DuplicateSubclass,
];
type TestSubclass =
  | TestSubclass1
  | TestSubclass2
  | TestSubclass3
  | DuplicateSubclass;
class TestSubclassWrapper {
  @Property(...Subclasses)
  objs: TestSubclass[] = [];
}

test("serialize subclasses", () => {
  const obj = new TestSubclassWrapper();
  let newSubclass;

  newSubclass = new TestSubclass1();
  newSubclass.foo = 5;
  obj.objs.push(newSubclass);

  newSubclass = new TestSubclass2();
  newSubclass.bar = "test";
  obj.objs.push(newSubclass);

  newSubclass = new TestSubclass3();
  newSubclass.baz = {
    asdf: "asdf",
  };
  obj.objs.push(newSubclass);

  newSubclass = new DuplicateSubclass();
  newSubclass.fizz = "buzz";
  obj.objs.push(newSubclass);

  const expected = {
    objs: [
      {
        _id: "TestSubclass1@1",
        foo: 5,
      },
      {
        _id: "TestSubclass2",
        bar: "test",
      },
      {
        _id: "TestSubclass3",
        baz: { asdf: "asdf" },
      },
      {
        _id: "TestSubclass1@2",
        fizz: "buzz",
      },
    ],
  };

  testSerialization(obj, expected, TestSubclassWrapper);
});
