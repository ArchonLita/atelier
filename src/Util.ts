export function construct<K extends string, V>(
  keys: readonly K[],
  value: V,
): { [key in K]: V } {
  return Object.fromEntries(keys.map((k) => [k, value])) as { [key in K]: V };
}

export interface Data {
  id?: string;
}

export class Logic<D extends Data> {
  constructor(public readonly data: D) { }
}

export interface Decoder<D extends Data = any, L extends Logic<D> = any> {
  id: string;
  construct: (data: D) => L;
}

export class Deserializer<D extends Data = any, L extends Logic<D> = any> {
  decoders = new Map<string, Decoder<D, L>>();
  registerDecoder(decoder: Decoder<D, L>) {
    this.decoders.set(decoder.id, decoder);
  }

  deserialize(data: D): L | undefined {
    if (!data.id) return;
    return this.decoders.get(data.id)?.construct(data);
  }
}
