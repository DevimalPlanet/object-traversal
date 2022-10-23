import { _Stack } from './stack';

export class _Queue<T = any> {
  private head?: Node<T> = undefined;
  private tail?: Node<T> = undefined;

  enqueue(v: T): void {
    if (this.tail) {
      this.tail = this.tail.next = { value: v };
    } else {
      this.head = this.tail = { value: v };
    }
  }

  dequeue(): T {
    const previousHeadValue = this.head!.value;
    this.head = this.head!.next;
    if (!this.head) {
      this.tail = this.head;
    }
    return previousHeadValue;
  }

  isEmpty(): boolean {
    return !this.head;
  }
}

export class _QueueToStackAdapter<T = any> implements _Stack<T> {
  constructor(private queue: _Queue<T>) {}

  push(v: T): void {
    this.queue.enqueue(v);
  }

  pop(): T {
    return this.queue.dequeue();
  }

  isEmpty(): boolean {
    return this.queue.isEmpty();
  }
}

interface Node<T> {
  value: any;
  next?: Node<T>;
}
