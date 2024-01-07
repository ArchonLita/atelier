export function roll(value: number) {
  const result = Math.floor(Math.random() * value + 1);
  console.log(`Rolling 1d${value}: ${result}`);
  return result;
}
