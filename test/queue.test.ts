import { _Queue, _QueueToStackAdapter } from '../src/queue';

describe(`queue`, () => {
  it('exists', () => {
    expect(_Queue).toBeTruthy();
  });

  it('can be instantiated', () => {
    const queue = new _Queue();
    expect(queue).toBeTruthy();
  });

  it('can enqueue/dequeue items', () => {
    const queue = new _Queue();
    expect(queue.isEmpty()).toBeTruthy();
    queue.enqueue(1);
    expect(queue.isEmpty()).toBeFalsy();
    queue.dequeue();
    expect(queue.isEmpty()).toBeTruthy();
  });

  it('dequeues items in the correct order', () => {
    const queue = new _Queue();
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
  });

  it('throws if dequeuing empty queue', () => {
    const queue = new _Queue();
    expect(() => queue.dequeue()).toThrow();
  });

  it('can be adapted to have a stack interface while continuing to behave like a queue', () => {
    const queue = new _Queue();
    const stack = new _QueueToStackAdapter(queue);
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toBe(1);
    expect(stack.pop()).toBe(2);
  });
});
