import { _Stack as Stack } from '../src/stack';

describe(`stack`, () => {
  it('exists', () => {
    expect(Stack).toBeTruthy();
  });

  it('can be instantiated', () => {
    const stack = new Stack();
    expect(stack).toBeTruthy();
  });

  it('can push/pop items', () => {
    const stack = new Stack();
    expect(stack.isEmpty()).toBeTruthy();
    stack.push(1);
    expect(stack.isEmpty()).toBeFalsy();
    stack.pop();
    expect(stack.isEmpty()).toBeTruthy();
  });

  it('pops items in the correct order', () => {
    const stack = new Stack();
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
  });

  it('throws if popping empty stack', () => {
    const stack = new Stack();
    expect(() => stack.pop()).toThrow();
  });
});
