import { expect, spyOn, test } from "bun:test";
import { dice, roll } from "./Dice";

test("roll dice properly", () => {
  const testValues = [0.49, 0.49];
  const randomSpy = spyOn(Math, "random");
  randomSpy.mockImplementation(() => testValues.pop()!);

  const testDice = dice(2, 20, 10);
  const result = roll(testDice);

  expect(result).toBe(30);
  expect(randomSpy).toHaveBeenCalledTimes(2);

  randomSpy.mockClear();
});
