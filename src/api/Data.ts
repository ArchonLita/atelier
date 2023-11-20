import { isPrimitive } from "./Util";

export type Constructor<T> = new () => T;

interface PropertyData {
  serializer: Serializer<any>;
}

interface Metadata {
  id?: string;
  properties: Record<string, PropertyData>;
}

function getMetadata(target: any): Metadata {
  return target.metadata ?? (target.metadata = { properties: {} });
}

export function Property(...ctors: Constructor<any>[]) {
  const serializer: Serializer<any> = (() => {
    if (ctors.length === 0) return DefaultSerializer;
    else if (ctors.length === 1) return new ClassSerializer(ctors[0]);
    else throw "Subclasses NYI"; // return new SubclassSerializer(ctors);
  })();

  return (target: any, key: string) => {
    getMetadata(target).properties[key] = { serializer };
  };
}

export interface Serializer<T> {
  serialize(obj: T): any;
  deserialize(obj: any): T;
}

export const DefaultSerializer: Serializer<any> = {
  serialize,
  deserialize,
};

export class ClassSerializer<T> implements Serializer<T> {
  constructor(private readonly ctor: Constructor<T>) { }

  serialize(obj: T): any {
    return serialize(obj);
  }

  deserialize(obj: any): T {
    return deserialize(obj, this.ctor);
  }
}

export interface SubclassSerializer extends Serializer<any> {
  constructor: (...ctors: Constructor<any>[]) => SubclassSerializer;
}

export function serialize(obj: any): any {
  // handle primitives
  if (isPrimitive(obj)) return obj;
  if (typeof obj === "function") return undefined; // don't even bother serializing functions
  if (Array.isArray(obj)) return obj.map((e) => serialize(e));

  const properties: Record<string, PropertyData> = obj.metadata?.properties;
  if (!properties) return { ...obj }; // no special serialization
  const res: any = {};
  for (const [k, v] of Object.entries(obj)) {
    const propertyData = properties[k];
    if (!propertyData) continue;
    res[k] = propertyData.serializer.serialize(v);
  }

  return res;
}

export function deserialize<T>(data: any, ctor?: Constructor<T>): T {
  if (!ctor) return data;

  const res = new ctor() as any;
  const properties = res.metadata?.properties;
  for (const [k, v] of Object.entries(data)) {
    const propertyData: PropertyData = properties?.[k];
    res[k] = propertyData ? propertyData.serializer.deserialize(v) : v;
  }

  res?.load();

  return res;
}
