export class Emitter {
  listeners = new Map<string, Set<Listener>>();

  addListener(id: string, listener: Listener) {
    if (!this.listeners.has(id)) this.listeners.set(id, new Set());
    this.listeners.get(id)!.add(listener);
  }

  call(event: string, data?: any) {
    this.listeners.get(event)?.forEach((listener) => listener.on(event, data));
  }
}

export interface Listener {
  on: (event: string, data?: any) => void;
}
