import { testSerialization } from "../api/Data.test";
import { Options } from "./Option";
import { expect, test } from "bun:test";

class TestOptions extends Options<string> {
  getOptions() {
    return ["a", "b", "c"];
  }
}

test("select from options", () => {
  const options = new TestOptions();
  expect(options.count).toEqual(3);
  expect(options.select(2)).toEqual(true);
  expect(options.selected).toEqual([2]);
  expect(options.getOptions()).toEqual(["a", "b", "c"]);
});

test("serialize options", () => {
  const options = new TestOptions();
  options.select(1);
  options.select(2);

  const data = {
    selected: [1, 2],
  };

  testSerialization(options, data, TestOptions);
});
