import { Optional } from "./Util";

type Constructor<T> = new () => T;

interface Property {
  ctor?: Constructor<any>;
}

interface Metadata {
  id?: string;
  properties: Record<string, Property>;
}

interface SerializableObject {
  metadata?: Metadata;
}

function createMetadata(target: SerializableObject): Metadata {
  return target.metadata ?? (target.metadata = { properties: {} });
}

function getMetadata(target: any): Optional<Metadata> {
  return target.metadata;
}

export function Property(ctor?: Constructor<any>) {
  return (target: any, key: string) => {
    createMetadata(target).properties[key] = { ctor };
  };
}

export function serialize(target: any): any {
  if (typeof target === "number") return target;
  if (Array.isArray(target)) return target.map(serialize);

  const properties = getMetadata(target)?.properties;
  // return raw objects if no serialization metadata
  if (!properties) return target;

  return Object.fromEntries(
    Object.entries(target)
      .filter(([k]) => Object.keys(properties).includes(k))
      .map(([k, v]) => [k, getMetadata(v) ? serialize(v) : v]),
  );
}

/*
 * Deserializes an object from data using the given constructor.
 * If the field has serialization metadata (i.e. the class definition
 * contains a Property annotation) the attached constructor will be
 * used to deserialize the value separately.
 */
export function deserialize<T>(data: any, ctor: Constructor<T>): T {
  const obj = new ctor() as any;
  const properties = getMetadata(obj)?.properties;
  Object.entries(data).forEach(([k, v]) => {
    const ctor = properties?.[k]?.ctor;
    obj[k] = ctor ? deserialize(v, ctor) : v;
  });
  obj?.load();
  return obj as T;
}
