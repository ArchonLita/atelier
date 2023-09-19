export function construct<K extends string, V>(
  keys: readonly K[],
  value: V,
): { [key in K]: V } {
  return Object.fromEntries(keys.map((k) => [k, value])) as { [key in K]: V };
}

export interface Serializer<T, D> {
  id: string;
  construct: (data: D) => T;
}
