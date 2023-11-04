import { Optional } from "./Util";

export interface Listener { }

export interface Event<_D = any> {
  id: string;
}

export function createEvent<D = undefined>(): Event<D> {
  return { id: crypto.randomUUID() };
}

interface Metadata {
  event: Event;
  priority: number;
}

interface MetadataObject {
  metadata?: Metadata;
}

type ExtractData<Type> = Type extends Event<infer X> ? X : never;

export type Method<E extends Event> = (data: ExtractData<E>) => void;

export interface Handler<E extends Event> {
  readonly listener?: Listener;
  readonly method: Method<E>;
  readonly priority: number;
}

export interface SubscribedFunction<D> extends PropertyDescriptor {
  value?: (data: D) => void;
}

export function Subscribe<D>(event: Event<D>, priority: number = 0) {
  return (target: any, key: string, _descriptor: SubscribedFunction<D>) => {
    (target[key] as MetadataObject).metadata = {
      event,
      priority,
    };
  };
}

export class Emitter {
  private handlers = new Map<string, Handler<any>[]>();

  removeMethod<E extends Event>(event: E, method: Method<E>) {
    const handlers = this.handlers.get(event.id);
    return handlers
      ? handlers
        .filter((h) => h.method == method)
        .map((h) => this.removeHandler(event.id, h))
        .reduce((acc, val) => acc || val, false)
      : false;
  }

  addHandler<E extends Event>(event: E, handler: Handler<E>) {
    const id = event.id;
    if (!this.handlers.has(id)) this.handlers.set(id, []);
    this.handlers.get(id)!.push(handler);
    this.handlers.get(id)!.sort((a, b) => b.priority - a.priority);
  }

  removeHandler<E extends Event>(event: string, handler: Handler<E>): boolean {
    const handlers = this.handlers.get(event);
    if (!handlers) return false;
    this.handlers.set(
      event,
      handlers.filter((h) => h != handler),
    );
    return handlers.length === this.handlers.get(event)!.length;
  }

  addListener(listener: Listener) {
    for (const label of Object.getOwnPropertyNames(
      Object.getPrototypeOf(listener),
    )) {
      const method: Method<any> = Reflect.get(listener, label);
      const metadata: Optional<Metadata> = Reflect.get(method, "metadata");
      if (!metadata) continue;
      this.addHandler(metadata.event, {
        listener,
        method,
        priority: metadata.priority,
      });
    }
  }

  addListeners(...listeners: Listener[]) {
    listeners.forEach(this.addListener.bind(this));
  }

  removeListener(listener: Listener) {
    for (const label of Object.getOwnPropertyNames(
      Object.getPrototypeOf(listener),
    )) {
      const method: Method<any> = Reflect.get(listener, label);
      const metadata: Optional<Metadata> = Reflect.get(method, "metadata");
      if (!metadata) continue;
      this.removeMethod(metadata.event, method);
    }
  }

  call<E extends Event<D>, D>(event: E, data?: D) {
    this.handlers
      .get(event.id)
      ?.forEach((handler) => handler.method.call(handler.listener, data));
  }
}
