interface EventMap {
  [key: string]: any;
}

export type Listener<T extends EventMap> = (
  data: T[Extract<keyof T, string>],
) => void;

export class Emitter<T extends EventMap> {
  listeners = new Map<Extract<keyof T, string>, Set<Listener<T>>>();

  addListener<E extends Extract<keyof T, string>>(
    event: E,
    listener: Listener<T>,
  ) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener);
  }

  removeListener<E extends Extract<keyof T, string>>(
    event: E,
    listener: Listener<T>,
  ): boolean {
    return !!this.listeners.get(event)?.delete(listener);
  }

  call<E extends Extract<keyof T, string>>(event: E, data: T[E]) {
    this.listeners.get(event)?.forEach((listener) => listener(data));
  }
}
