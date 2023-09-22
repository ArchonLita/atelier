import { expect, test } from "bun:test";
import { construct, notEmpty } from "./Util";

test("constructs map with default value from keys", () => {
  const keys = ["a", "b", "c"] as const;

  expect(construct(keys, 0)).toEqual({
    a: 0,
    b: 0,
    c: 0,
  });
});

test("notEmpty filters out null and undefined", () => {
  const arr = [undefined, null, undefined, 39, "miku", {}, []];
  expect(arr.filter(notEmpty)).toEqual([39, "miku", {}, []]);
});
