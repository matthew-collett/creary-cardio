export class Observable {
  private listeners: Set<() => void> = new Set()

  subscribe(callback: () => void): () => void {
    this.listeners.add(callback)
    return () => this.unsubscribe(callback)
  }

  unsubscribe(callback: () => void): void {
    this.listeners.delete(callback)
  }

  protected notify(): void {
    this.listeners.forEach(callback => callback())
  }
}
