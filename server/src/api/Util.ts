import { exists, mkdir } from "fs/promises";

export type Optional<T> = T | undefined;
export interface Loadable {
  load: () => void;
}

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

export function isPrimitive(val: any): boolean {
  return val !== Object(val);
}

export function hash(str: string): number {
  let res = 0;

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    res = (res << 5) - res + code;
    res = res & res;
  }

  return Math.abs(res);
}

export async function generateDir(path: string) {
  if (!(await exists(path))) await mkdir(path);
}

export function getMethodLabels(obj: any) {
  let proto = Object.getPrototypeOf(obj);
  const labels = new Set<string>();
  while (proto) {
    Object.getOwnPropertyNames(proto).forEach((label) => labels.add(label));
    proto = Object.getPrototypeOf(proto);
  }

  return [...labels].filter((label) => typeof obj[label] === "function");
}
