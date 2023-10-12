interface EventMap {
  [key: string]: any;
}

export type Method<T extends EventMap> = (
  data: T[Extract<keyof T, string>],
) => void;

export interface Handler<T extends EventMap> {
  readonly method: Method<T>;
  readonly priority: number;
}

export type Listener = {};

export class Emitter<T extends EventMap> {
  handlers = new Map<Extract<keyof T, string>, Handler<T>[]>();

  addMethod<E extends Extract<keyof T, string>>(event: E, handler: Method<T>) {
    this.addHandler(event, { method: handler, priority: 0 });
  }

  removeMethod<E extends Extract<keyof T, string>>(
    event: E,
    method: Method<T>,
  ): boolean {
    const handlers = this.handlers.get(event);
    return handlers
      ? Array.from(handlers)
        .filter((handler) => handler.method == method)
        .map((handler) => this.removeHandler(event, handler))
        .reduce((acc, val) => acc || val, false)
      : false;
  }

  addHandler<E extends Extract<keyof T, string>>(
    event: E,
    handler: Handler<T>,
  ) {
    if (!this.handlers.has(event)) this.handlers.set(event, []);
    this.handlers.get(event)!.push(handler);
    this.handlers.get(event)!.sort((a, b) => b.priority - a.priority);
  }

  removeHandler<E extends Extract<keyof T, string>>(
    event: E,
    handler: Handler<T>,
  ): boolean {
    const handlers = this.handlers.get(event);
    if (!handlers) return false;
    this.handlers.set(
      event,
      handlers.filter((h) => h != handler),
    );
    return handlers.length == this.handlers.get(event)!.length;
  }

  addListener(listener: Listener) {
    for (const label of Object.getOwnPropertyNames(
      Object.getPrototypeOf(listener),
    )) {
      const method = Reflect.get(listener, label);
      const metadata = getMetadata(method);
      if (metadata.event)
        this.addMethod(metadata.event as any, method.bind(listener));
    }
  }

  call<E extends Extract<keyof T, string>>(event: E, data: T[E]) {
    this.handlers.get(event)?.forEach((handler) => handler.method(data));
  }
}

interface Metadata {
  event?: string;
}

interface HandlerObject {
  metadata?: Metadata;
}

function getMetadata(target: HandlerObject): Metadata {
  if (!target.metadata) target.metadata = {};
  return target.metadata;
}

export function Subscribe(event: string) {
  return (target: any, key: string) => {
    const metadata = getMetadata(target[key]);
    metadata.event = event;
  };
}
