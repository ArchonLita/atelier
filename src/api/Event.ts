// export type Method<E extends EventConstructor<any, any>> = (
//   ...args: ConstructorParameters<E>
// ) => Event<any, any>;
//
// export interface Handler<E extends EventConstructor<any, any>> {
//   readonly method: Method<E>;
//   readonly priority: number;
// }

export interface Listener { }

export interface Event<_D = any> {
  id: string;
}

export function createEvent<D = undefined>(): Event<D> {
  return { id: crypto.randomUUID() };
}

interface Metadata {
  event: string;
  priority: number;
}

interface MetadataObject {
  metadata?: Metadata;
}

type ExtractData<Type> = Type extends Event<infer X> ? X : never;

export type Method<E extends Event> = (data: ExtractData<E>) => void;

export interface Handler<E extends Event> {
  readonly method: Method<E>;
  readonly priority: number;
}

export interface SubscribedFunction<D> extends PropertyDescriptor {
  value?: (data: D) => void;
}

export function Subscribe<D>(event: Event<D>, priority: number = 0) {
  return (target: any, key: string, _descriptor: SubscribedFunction<D>) => {
    (target[key] as MetadataObject).metadata = {
      event: event.id,
      priority,
    };
  };
}

export class Emitter {
  private handlers = new Map<string, Handler<any>[]>();

  addHandler<E extends Event>(event: string, handler: Handler<E>) {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event)!.push(handler);
    this.handlers.get(event)!.sort((a, b) => b.priority - a.priority);
  }

  addListener(listener: Listener) {
    for (const label of Object.getOwnPropertyNames(
      Object.getPrototypeOf(listener),
    )) {
      const method: Method<any> = Reflect.get(listener, label);
      const metadata: Metadata | undefined = Reflect.get(method, "metadata");
      if (!metadata) continue;
      this.addHandler(metadata.event, {
        method: method.bind(listener),
        priority: metadata.priority,
      });
    }
  }

  call<E extends Event<D>, D>(event: E, data?: D) {
    this.handlers.get(event.id)?.forEach((handler) => handler.method(data));
  }
}
