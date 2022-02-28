export class _Stack<T = any> {
  private tail?: Node<T> = undefined;

  push(v: T): void {
    this.tail = { value: v, prev: this.tail };
  }

  pop(): T {
    const node = this.tail;
    this.tail = this.tail!.prev;
    return node!.value;
  }

  isEmpty(): boolean {
    return !this.tail;
  }

  reset(): void {
    this.tail = undefined;
  }
}

interface Node<T> {
  value: any;
  prev?: Node<T>;
}
