import { isPrimitive } from "./Util";

export type Constructor<T> = new () => T;

export class TypeMap<T> {
  private readonly map: Record<string, Constructor<T>[]> = {};

  constructor(...ctors: Constructor<T>[]) {
    ctors.forEach((ctor) => this.add(ctor));
  }

  add(ctor: Constructor<T>) {
    if (!this.map[ctor.name]) this.map[ctor.name] = [];
    const ctors = this.map[ctor.name];
    if (!ctors.includes(ctor)) ctors.push(ctor);
  }

  hash(ctor?: Function): string | undefined {
    const ctors = this.map[ctor?.name ?? " "];
    if (!ctors) return undefined;
    const index = ctors.findIndex((i) => i == ctor);
    return ctor?.name + (ctors.length <= 1 ? "" : `@${index + 1}`);
  }

  get(hash: string): Constructor<T> {
    const [name, index] = hash.split("@");
    return this.map[name][typeof index === "number" ? parseInt(index) - 1 : 0];
  }

  values() {
    return Object.values(this.map).flat();
  }

  size() {
    return Object.keys(this.map).length;
  }
}

export function Register<T>(typeMap: TypeMap<T>) {
  return (ctor: Constructor<T>) => {
    typeMap.add(ctor);
  };
}

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

export function Property<T>(
  ctors?: Constructor<T> | Constructor<T>[] | TypeMap<T> | Serializer<T>,
) {
  const serializer: Serializer<T> = (() => {
    if (!ctors) return DefaultSerializer;

    if (Array.isArray(ctors)) {
      if (ctors.length === 0) return DefaultSerializer;
      if (ctors.length === 1) return new ClassSerializer(ctors[0]);
      else return new SubclassSerializer(ctors);
    } else if (typeof ctors === "function") {
      return new ClassSerializer(ctors);
    } else if (ctors instanceof TypeMap) {
      return new SubclassSerializer(ctors);
    }

    return ctors;
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
  constructor(private readonly ctor: Constructor<T>) {}

  serialize(obj: T): any {
    return serialize(obj);
  }

  deserialize(obj: any): T {
    return deserialize(obj, this.ctor);
  }
}

export class SubclassSerializer<T> implements Serializer<T> {
  private typeMap = new TypeMap<T>();

  constructor(ctors: Constructor<T>[] | TypeMap<T>) {
    if (Array.isArray(ctors)) ctors.forEach((ctor) => this.typeMap.add(ctor));
    else this.typeMap = ctors;
  }

  serialize(obj: T): any {
    const res = serialize(obj);
    const id = this.typeMap.hash(obj?.constructor);
    res["_id"] = id;
    return res;
  }

  deserialize(obj: any): T {
    const id = obj["_id"];
    if (!id) throw "Missing Id Deserializing Subclass";
    delete obj["_id"];
    return deserialize(obj, this.typeMap.get(id));
  }
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
    if (v === undefined) continue;

    const propertyData = properties[k];
    if (!propertyData) continue;

    const serializer = propertyData.serializer;
    res[k] = Array.isArray(v)
      ? v.map(serializer.serialize.bind(serializer))
      : serializer.serialize(v);
  }

  return res;
}

export function deserialize<T>(data: any, ctor?: Constructor<T>): T {
  if (!ctor) return data;

  const res = new ctor() as any;
  const properties = res.metadata?.properties;
  for (const [k, v] of Object.entries(data)) {
    const propertyData: PropertyData = properties?.[k];
    if (!propertyData) {
      res[k] = v;
      continue;
    }

    const serializer = propertyData.serializer;
    res[k] = Array.isArray(v)
      ? v.map((elem) => serializer.deserialize(elem))
      : serializer.deserialize(v);
  }

  res?.load?.();

  return res;
}
