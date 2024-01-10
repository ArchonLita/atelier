import { expect, test } from "bun:test";
import { Wolf } from "./Wolf";

test("wolf attribs", () => {
  const wolf = new Wolf();
  wolf.load();
  expect(wolf.armorClass).toEqual(13);
  expect(wolf.skillModifiers["perception"]).toEqual(3);
  expect(wolf.skillModifiers["stealth"]).toEqual(4);
});
