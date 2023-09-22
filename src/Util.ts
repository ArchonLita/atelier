export function construct<K extends string, V>(
  keys: readonly K[],
  value: V,
): { [key in K]: V } {
  return Object.fromEntries(keys.map((k) => [k, value])) as { [key in K]: V };
}

export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export interface Data {
  id?: string;
}

export class Logic<D extends Data> {
  constructor(public readonly data: D) { }
}

export interface Decoder<D extends Data = any, L extends Logic<D> = any> {
  id: string;
  build: (data: D) => L;
}

export class Deserializer<D extends Data = any, L extends Logic<D> = any> {
  decoders = new Map<string, Decoder<D, L>>();
  registerDecoder(decoder: Decoder<D, L>) {
    this.decoders.set(decoder.id, decoder);
  }

  deserialize(data: D): L | undefined {
    if (!data.id) return;
    return this.decoders.get(data.id)?.build(data);
  }
}

export class Emitter {
  listeners = new Map<string, Set<Listener>>();

  addListener(id: string, listener: Listener) {
    if (!this.listeners.has(id)) this.listeners.set(id, new Set());
    this.listeners.get(id)!.add(listener);
  }

  call(event: string, data: any) {
    this.listeners.get(event)?.forEach((listener) => listener.on(event, data));
  }
}

export interface Listener {
  on: (event: string, data: any) => void;
}
