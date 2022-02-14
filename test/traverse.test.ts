import { TraversalCallback, TraversalCallbackContext, traverse } from '../src';
// import { createBenchMock } from '../benchmarks/helper';
const { createBenchMock } = require('../benchmarks/helper');
import traverseJs from 'traverse';

describe(`object-traversal`, () => {
  it('exists', () => {
    expect(traverse).toBeTruthy();
  });

  it('throws when first parameter is not an object', () => {
    const mockFn = jest.fn();
    expect(() => traverse(1 as any, mockFn)).toThrowError(
      'First argument must be an object'
    );
  });

  it('processes the root object correctly', () => {
    const allContexts: TraversalCallbackContext[] = [];
    const mockFn = jest.fn(context => allContexts.push(context));
    const mockData = {};

    traverse(mockData, mockFn);

    expect(mockFn).toBeCalledTimes(1);
    expect(allContexts[0].parent).toBeNull();
    expect(allContexts[0].value).toEqual(mockData);
    expect(allContexts[0].key).toEqual(null);
    expect(allContexts[0].meta.currentPath).toEqual(null);
    expect(allContexts[0].meta.depth).toEqual(0);
  });

  it('passes parent, key, value, meta as arguments to processing callback', () => {
    const allContexts: TraversalCallbackContext[] = [];
    const mockFn = jest.fn((context: TraversalCallbackContext) =>
      allContexts.push(context)
    );
    const mockData = { lastSegment: 2 };

    traverse(mockData, mockFn);
    const { parent, key, value, meta } = allContexts[1];

    expect(allContexts.length).toBe(2);
    expect(mockFn).toBeCalled();
    expect(parent).toEqual(mockData);
    expect(key).toEqual('lastSegment');
    expect(value).toEqual(2);
    expect(typeof meta).toEqual('object');
  });

  it('passes deep nested paths into meta', () => {
    const allContexts: TraversalCallbackContext[] = [];
    const mockFn = jest.fn((context: TraversalCallbackContext) =>
      allContexts.push(context)
    );
    const mockData = { somePath: { nestedPath: 3 } };

    traverse(mockData, mockFn);
    const { parent, value, meta } = allContexts[2];

    expect(allContexts.length).toBe(3);
    expect(mockFn).toBeCalled();
    expect(parent).toEqual({ nestedPath: 3 });
    expect(meta.currentPath).toEqual('somePath.nestedPath');
    expect(value).toEqual(3);
    expect(typeof meta).toEqual('object');
  });

  it('properly handles cycles', () => {
    const mock1 = { a: 1, b: null as any };
    const mock2 = { b: 1, a: null as any };
    mock1.b = mock2;
    mock2.a = mock1;

    const allContexts: TraversalCallbackContext[] = [];
    const mockFn = jest.fn((context: TraversalCallbackContext) =>
      allContexts.push(context)
    );

    traverse(mock1, mockFn);

    expect(mockFn).toBeCalledTimes(4);
  });

  it('practical example: get full names', () => {
    interface Person {
      firstName: string;
      lastName: string;
      age: number;
      children: Person[];
    }

    const mockData: Person = {
      firstName: 'firstName',
      lastName: 'lastName',
      age: 0,
      children: [
        {
          firstName: 'firstName1',
          lastName: 'lastName1',
          age: 1,
          children: [],
        },
        {
          firstName: 'firstName2',
          lastName: 'lastName2',
          age: 2,
          children: [],
        },
      ],
    };

    const allFullNames: string[] = [];
    const callback: TraversalCallback = context => {
      const { value } = context;
      if (typeof value === 'object' && value.firstName) {
        allFullNames.push(`${value.firstName} ${value.lastName}`);
      }
    };

    traverse(mockData, callback);
    allFullNames.sort();

    expect(allFullNames).toEqual([
      'firstName lastName',
      'firstName1 lastName1',
      'firstName2 lastName2',
    ]);
  });

  it('practical example: find full paths matching age 2', () => {
    const mockData = {
      firstName: 'firstName',
      lastName: 'lastName',
      age: 0,
      children: [
        {
          firstName: 'firstName1',
          lastName: 'lastName1',
          age: 1,
          children: [],
        },
        {
          firstName: 'firstName2',
          lastName: 'lastName2',
          age: 2,
          children: [],
        },
      ],
    };

    const fullPaths: string[] = [];
    const callback: TraversalCallback = context => {
      const { key, value, meta } = context;
      if (key === 'age' && value === 2) {
        fullPaths.push(meta.currentPath!);
      }
    };

    traverse(mockData, callback);

    expect(fullPaths.length).toEqual(1);
    expect(fullPaths[0]).toEqual('children.1.age');
  });

  it('practical example: replace a value when condition matches', () => {
    const mockData = {
      firstName: 'firstName',
      lastName: 'lastName',
      age: 0,
      children: [
        {
          firstName: 'firstName1',
          lastName: 'lastName1',
          age: 1,
          children: [],
        },
        {
          firstName: 'firstName2',
          lastName: 'lastName2',
          age: 2,
          children: [],
        },
      ],
    };

    const callback: TraversalCallback = context => {
      const { parent, key, meta } = context;
      if (/children\.1\.age/.test(meta.currentPath!)) {
        parent![key!] = 3;
      }
    };

    traverse(mockData, callback);

    expect(mockData.children[1].age).toEqual(3);
    expect(mockData.children[0].age).toEqual(1);
  });

  describe('object-traversal and traverse packages ', () => {
    const dimensions = 10;
    const bench10x10WithCycles = createBenchMock(dimensions, dimensions, true);
    const bench10x10WithoutCycles = createBenchMock(
      dimensions,
      dimensions,
      false
    );

    it('object-traversal skips duplicate nodes (unlike traverse)', () => {
      let counter = 0;
      let counter2 = 0;
      const callback = () => {
        counter++;
      };

      const callback2 = () => {
        counter2++;
      };

      traverse(bench10x10WithCycles, callback);
      traverseJs(bench10x10WithCycles).forEach(callback2);

      expect(counter).toEqual(counter2 - dimensions);
    });

    it('traverse the same amount of non-cyclic nodes', () => {
      let counter = 0;
      let counter2 = 0;
      const callback = () => {
        counter++;
      };

      const callback2 = () => {
        counter2++;
      };

      traverse(bench10x10WithoutCycles, callback);
      traverseJs(bench10x10WithoutCycles).forEach(callback2);

      expect(counter).toEqual(counter2);
    });
  });
});
