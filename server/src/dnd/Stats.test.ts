import { expect, test } from "bun:test";
import { Effects, applyEffects } from "./Stats";

test("apply effects to a value", () => {
  const effects = [
    Effects.addAbilityScore("wisdom", 1),
    Effects.addAbilityScore("wisdom", 3),
    Effects.addAbilityScore("wisdom", 5),
    Effects.addAttribute("speed", 5),
    Effects.addAttribute("speed", 15),
    Effects.addAttribute("speed", -30),
  ];

  expect(
    applyEffects(0, effects, Effects.filter("ability_score", "wisdom")),
  ).toEqual(9);

  expect(
    applyEffects(0, effects, Effects.filter("attribute", "speed")),
  ).toEqual(-10);
});
