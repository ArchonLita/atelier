type Constructor<T> = new () => T;

interface Metadata {
  id?: string;
  properties: string[];
}

interface SerializableObject {
  metadata?: Metadata;
}

function getMetadata(target: SerializableObject): Metadata {
  if (!target.metadata) target.metadata = { properties: [] };
  return target.metadata;
}

export function Property(target: any, propertyKey: string) {
  getMetadata(target).properties.push(propertyKey);
}

export function serialize(target: any): any {
  const properties = getMetadata(target).properties;
  return Object.fromEntries(
    Object.entries(target).filter(([k]) => properties.includes(k)),
  );
}

export function deserialize<T>(data: any, ctor: Constructor<T>): T {
  const obj = new ctor() as any;
  Object.entries(data).forEach(([k, v]) => (obj[k] = v));
  return obj as T;
}
