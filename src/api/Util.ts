export function construct<K extends string, V>(
  keys: readonly K[],
  value: V,
): Record<K, V> {
  return keys.reduce(
    (res, key) => ({ ...res, [key]: value }),
    {} as Record<K, V>,
  );
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
