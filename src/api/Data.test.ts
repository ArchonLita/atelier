import { test, expect } from "bun:test";
import { Registry, Data, Builder, Proto } from "./Data";

interface AbstractTestData extends Data {
  foo: number;
  bar: string;
}

abstract class AbstractTestProto<
  D extends AbstractTestData = AbstractTestData,
> extends Proto<D> {
  abstract baz(): string;
}

interface TestDataA extends AbstractTestData {
  extraA: string;
}

class TestProtoA extends AbstractTestProto<TestDataA> {
  baz = () => this.data.extraA;
}

const TestProtoADecoder: Builder<TestProtoA> = {
  id: "A",
  build: (data: TestDataA) => new TestProtoA(data),
};

interface TestDataB extends AbstractTestData {
  extraB: string;
}

class TestProtoB extends AbstractTestProto<TestDataB> {
  baz = () => this.data.extraB;
}

const TestProtoBDecoder: Builder<TestProtoB> = {
  id: "B",
  build: (data: TestDataB) => new TestProtoB(data),
};

const TestDataBuilder = new Registry<AbstractTestProto>();
TestDataBuilder.registerBuilder(TestProtoADecoder);
TestDataBuilder.registerBuilder(TestProtoBDecoder);

test("builds proto from data", () => {
  const dataA: TestDataA = {
    id: "A",
    extraA: "test A",
    foo: 39,
    bar: "data a",
  };

  const dataB: TestDataB = {
    id: "B",
    extraB: "test B",
    foo: 42,
    bar: "data b",
  };

  const protoA = TestDataBuilder.construct(dataA)!;
  const protoB = TestDataBuilder.construct(dataB)!;

  expect(protoA.baz()).toEqual("test A");
  expect(protoB.baz()).toEqual("test B");

  expect(protoA.data).toBe(dataA);
  expect(protoB.data).toBe(dataB);
});
