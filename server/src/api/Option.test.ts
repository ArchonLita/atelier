import { test, expect } from "bun:test";
import { testSerialization } from "./Data.test";
import { MultiOptions, Options } from "./Option";

class TestOptions extends Options<string> {
  count = 2;
  options = ["a", "b", "c"];
}

test("select from options", () => {
  const options = new TestOptions();
  expect(options.count).toEqual(2);
  expect(options.select(2)).toEqual(true);
  expect(options.selected).toEqual([2]);
  expect(options.options).toEqual(["a", "b", "c"]);
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

class TestMultiOptions extends MultiOptions<string> {
  model = {
    count: 2,
    options: [
      "a",
      "b",
      "c",
      {
        count: 1,
        options: ["foo", "bar", "baz"],
      },
    ],
  };
}

test("select from multioptions", () => {
  const options: TestMultiOptions = new TestMultiOptions();

  // erroneous inputs
  expect(options.select([])).toBe(false); // not enough options selected
  expect(options.select([0, 1, 2])).toBe(false); // too many options selected
  expect(options.select([0, 0])).toBe(false); // duplicate options selected
  expect(options.select([0, 3])).toBe(false); // suboptions not selected
  expect(options.select([0, [3, 0, 1]])).toBe(false); // too many suboptions selected
  expect(options.select([0, [3, 0, 0]])).toBe(false); // duplicate suboptions selected

  expect(options.select([0, [3, 0]])).toBe(true);
  expect(options.selected).toEqual(["a", "foo"]);
});
