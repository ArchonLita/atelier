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

export function getLabels(obj: any) {
  let proto = Object.getPrototypeOf(obj);
  const labels = new Set<string>();
  while (proto) {
    Object.getOwnPropertyNames(proto).forEach((label) => labels.add(label));
    proto = Object.getPrototypeOf(proto);
  }

  return [...labels];
}

export function getMethodLabels(obj: any) {
  return getLabels(obj).filter((label) => typeof obj[label] === "function");
}

export function getObjectLabels(obj: any) {
  return getLabels(obj).filter((label) => typeof obj[label] !== "function");
}

// prettier-ignore
export type Split<S extends string, D extends string> =
  string extends S ? string[] :
  S extends '' ? [] :
  S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

export function removeAll<T>(arr: T[], item: T) {
  for (let i = arr.length; i--; ) {
    if (arr[i] === item) arr.splice(i, 1);
  }
}
