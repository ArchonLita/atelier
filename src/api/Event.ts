interface EventMap {
  [key: string]: any;
}

export type Handler<T extends EventMap> = (
  data: T[Extract<keyof T, string>],
) => void;

export type Listener = {};

export class Emitter<T extends EventMap> {
  handlers = new Map<Extract<keyof T, string>, Set<Handler<T>>>();

  addHandler<E extends Extract<keyof T, string>>(
    event: E,
    handler: Handler<T>,
  ) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(handler);
  }

  removeHandler<E extends Extract<keyof T, string>>(
    event: E,
    handler: Handler<T>,
  ): boolean {
    return !!this.handlers.get(event)?.delete(handler);
  }

  addListener(listener: Listener) {
    for (const label of Object.getOwnPropertyNames(
      Object.getPrototypeOf(listener),
    )) {
      const method = Reflect.get(listener, label);
      const metadata = getMetadata(method);
      if (metadata.event)
        this.addHandler(metadata.event as any, method.bind(listener));
    }
  }

  call<E extends Extract<keyof T, string>>(event: E, data: T[E]) {
    this.handlers.get(event)?.forEach((handler) => handler(data));
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
