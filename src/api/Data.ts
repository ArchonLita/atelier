export interface Data {
  id?: string;
}

export class Proto<D extends Data> {
  constructor(public readonly data: D) { }
}

type TypeParam<T> = T extends Proto<infer T> ? T : never;

export interface Builder<P extends Proto<any>> {
  id: string;
  build: (data: TypeParam<P>) => P;
}

export class Registry<P extends Proto<any>> {
  decoders = new Map<string, Builder<P>>();
  registerBuilder(decoder: Builder<P>) {
    this.decoders.set(decoder.id, decoder);
  }

  construct(data: TypeParam<P>): P | undefined {
    if (!data.id) return;
    return this.decoders.get(data.id)?.build(data);
  }
}
