export interface Dice {
  count: number;
  value: number;
  constant: number;
}

export function dice(count: number, value: number, constant: number = 0): Dice {
  return {
    count,
    value,
    constant,
  };
}

function diceToString(dice: Dice) {
  if (dice.count !== 0) {
    if (dice.constant === 0) return `${dice.count}d${dice.value}`;
    else return `${dice.count}d${dice.value}+${dice.constant}`;
  }

  if (dice.constant !== 0) return `${dice.constant}`;
}

export function roll(dice: Dice) {
  const rolls = Array.from({ length: dice.count }, () =>
    Math.floor(Math.random() * dice.value + 1),
  );
  const result = rolls.reduce((acc, val) => acc + val, 0) + dice.constant;
  console.log(`Rolling ${diceToString(dice)}: ${result}`);
  return result;
}
