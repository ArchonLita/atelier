import { expect, test } from "bun:test";
import {
  Constructor,
  Property,
  Register,
  Serializer,
  TypeMap,
  deserialize,
  serialize,
} from "./Data";
import { Loadable } from "./Util";

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

test("serializes objects from class", () => {
  const testObj = new TestClass();
  testObj.foo = 5;
  testObj.load();

  const data = { foo: 5 };

  testSerialization(testObj, data, TestClass);
});

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

test("register subclasses", () => {
  interface Subclass {}
  const Subclasses = new TypeMap<Subclass>();

  @Register(Subclasses)
  class Subclass1 implements Subclass {}
  @Register(Subclasses)
  class Subclass2 implements Subclass {}
  @Register(Subclasses)
  class Subclass3 implements Subclass {}

  expect(Subclasses).toEqual(new TypeMap(Subclass1, Subclass2, Subclass3));
});

test("serialize subclasses", () => {
  interface Subclass {}
  const Subclasses = new TypeMap<Subclass>();

  class TestSubclassWrapper {
    @Property(Subclasses)
    objs: Subclass[] = [];
  }

  @Register(Subclasses)
  class TestSubclass1 {
    @Property()
    foo?: number;
  }

  @Register(Subclasses)
  class TestSubclass2 {
    @Property()
    bar?: string;
  }

  @Register(Subclasses)
  class TestSubclass3 {
    @Property()
    baz?: object;
  }

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

  {
    @Register(Subclasses)
    class TestSubclass1 {
      @Property()
      fizz?: "buzz";
    }

    newSubclass = new TestSubclass1();
    newSubclass.fizz = "buzz";
    obj.objs.push(newSubclass);
  }

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

test("custom serializer", () => {
  const TestSerializer: Serializer<number> = {
    serialize: (obj: number) => ({ value: obj }),
    deserialize: (obj: any) => obj.value,
  };

  class TestClass {
    @Property(TestSerializer)
    field?: number;

    constructor() {}
  }

  const obj = new TestClass();
  obj.field = 39;

  testSerialization(obj, { field: { value: 39 } }, TestClass);
});
