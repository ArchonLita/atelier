import { test, expect } from "bun:test";
import { Builder, Data, Decoder, Proto } from "./Data";

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
  extraA: boolean;
}

class TestProtoA extends AbstractTestProto<TestDataA> {
  baz() {
    return `Extra A: ${this.data.extraA} ${this.data.foo} ${this.data.bar}`;
  }
}

const TestProtoADecoder: Decoder<TestProtoA> = {
  id: "A",
  build: (data: TestDataA) => new TestProtoA(data),
};

interface TestDataB extends AbstractTestData {
  extraB: boolean;
}

class TestProtoB extends AbstractTestProto<TestDataB> {
  baz() {
    return `Extra B: ${this.data.extraB} ${this.data.foo} ${this.data.bar}`;
  }
}

const TestProtoBDecoder: Decoder<TestProtoB> = {
  id: "B",
  build: (data: TestDataB) => new TestProtoB(data),
};

const TestDataBuilder = new Builder<AbstractTestProto>();
TestDataBuilder.registerDecoder(TestProtoADecoder);
TestDataBuilder.registerDecoder(TestProtoBDecoder);

test("builds proto from data", () => {
  const dataA: TestDataA = {
    id: "A",
    extraA: true,
    foo: 39,
    bar: "data a",
  };

  const dataB: TestDataB = {
    id: "B",
    extraB: true,
    foo: 39,
    bar: "data b",
  };

  const protoA = TestDataBuilder.deserialize(dataA);
  const protoB = TestDataBuilder.deserialize(dataB);

  expect(protoA).toEqual(new TestProtoA(dataA));
  expect(protoB).toEqual(new TestProtoB(dataB));
});
