import {
  TraversalCallback,
  TraversalCallbackContext,
  TraversalType,
  traverse,
} from '../src';
// import { createBenchMock } from '../benchmarks/helper';
const { createBenchMock } = require('../benchmarks/helper');
import traverseJs from 'traverse';

const mockDimensions = 10;
/** the total amount of nodes that exist in mock objects */
const nodeCount = mockDimensions * mockDimensions + mockDimensions + 1;
const mockWithCycles = createBenchMock(mockDimensions, mockDimensions, true);
const mockWithoutCycles = createBenchMock(
  mockDimensions,
  mockDimensions,
  false
);

const traversalTypes: TraversalType[] = ['depth-first', 'breadth-first'];
for (let traversalType of traversalTypes) {
  describe(`object-traversal (${traversalType})`, () => {
    describe('base functionality', () => {
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

        traverse(mockData, mockFn, { traversalType });

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

        traverse(mockData, mockFn, { traversalType });
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

        traverse(mockData, mockFn, { traversalType });
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

        traverse(mock1, mockFn, { traversalType });

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

        traverse(mockData, callback, { traversalType });
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

        traverse(mockData, callback, { traversalType });

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

        traverse(mockData, callback, { traversalType });

        expect(mockData.children[1].age).toEqual(3);
        expect(mockData.children[0].age).toEqual(1);
      });
    });

    describe('utility configuration options', () => {
      it('traverses the entire object when maxNodeCount omitted', () => {
        let counter = 0;
        const callback = () => {
          counter++;
        };

        traverse(mockWithoutCycles, callback, {
          traversalType,
        });
        expect(counter).toEqual(nodeCount);
      });

      it('traverses the entire object when maxNodeCount is bigger than nodeCount', () => {
        const maxNodeCount = nodeCount + 1;
        let counter = 0;
        const callback = () => {
          counter++;
        };

        traverse(mockWithoutCycles, callback, {
          traversalType,
          maxNodeCount,
        });
        expect(counter).toEqual(nodeCount);
      });

      it('halts when maxNodeCount is reached in non-cyclic objects', () => {
        const maxNodeCount = 3;
        let counter = 0;
        const callback = () => {
          counter++;
        };

        traverse(mockWithoutCycles, callback, {
          traversalType,
          maxNodeCount,
        });
        expect(counter).toEqual(maxNodeCount);
      });

      it('halts when maxNodeCount is reached in cyclic objects with cycleHandling is false', () => {
        const maxNodeCount = nodeCount + 1; // + 1 tests that it continue traversing infinite loop, if it weren't for maxNodeCount option
        let counter = 0;
        const callback = () => {
          counter++;
        };

        traverse(mockWithCycles, callback, {
          traversalType,
          maxNodeCount,
          cycleHandling: false,
        });
        expect(counter).toEqual(maxNodeCount);
      });

      it('works with omitted maxDepth', () => {
        const depths = new Set<number>();
        const callback = (tm: TraversalCallbackContext) => {
          depths.add(tm.meta.depth);
        };

        traverse(mockWithCycles, callback, {
          traversalType,
        });

        const depthArray = Array.from(depths.values()).sort((a, b) => a - b);
        const expected = [];
        for (let i = 0; i < mockDimensions + 1; i++) {
          expected.push(i);
        }
        expect(depthArray).toEqual(expected);
      });

      it('works with specified maxDepth', () => {
        const maxDepth = 5;
        const depths = new Set();
        const callback = (tm: TraversalCallbackContext) => {
          depths.add(tm.meta.depth);
        };

        traverse(mockWithCycles, callback, {
          traversalType,
          maxDepth,
        });

        const depthArray = Array.from(depths.values()).sort();
        const expected = [];
        for (let i = 0; i < maxDepth + 1; i++) {
          expected.push(i);
        }
        expect(depthArray).toEqual(expected);
      });
    });

    describe('object-traversal compared with traverse package', () => {
      it('object-traversal skips duplicate nodes (unlike traverse)', () => {
        let counter = 0;
        let counter2 = 0;
        const callback = () => {
          counter++;
        };

        const callback2 = () => {
          counter2++;
        };

        traverse(mockWithCycles, callback, { traversalType });
        traverseJs(mockWithCycles).forEach(callback2);

        expect(counter).toEqual(counter2 - mockDimensions);
      });

      it('both packages traverse the same amount nodes when no cycles exist', () => {
        let counter = 0;
        let counter2 = 0;
        const callback = () => {
          counter++;
        };

        const callback2 = () => {
          counter2++;
        };

        traverse(mockWithoutCycles, callback, { traversalType });
        traverseJs(mockWithoutCycles).forEach(callback2);

        expect(counter).toEqual(counter2);
      });
    });
  });
}

describe(`traversal order`, () => {
  it('traverses depth-first by default', () => {
    const root = {
      value: 0,
      children: [
        {
          value: 1,
          children: [{ value: 2 }, { value: 3, children: [{ value: 4 }] }],
        },
        { value: 5, children: [{ value: 6 }] },
      ],
    };
    const values: number[] = [];
    traverse(root, ({ value }) => {
      if (typeof value === 'number') {
        values.push(value);
      }
    });
    expect(values).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('can traverse in level order (breath-first)', () => {
    const root = {
      value: 0,
      children: [
        {
          value: 1,
          children: [{ value: 2 }, { value: 3, children: [{ value: 4 }] }],
        },
        { value: 5, children: [{ value: 6 }] },
      ],
    };
    const values: number[] = [];
    traverse(
      root,
      ({ value }) => {
        if (typeof value === 'number') {
          values.push(value);
        }
      },
      { traversalType: 'breadth-first' }
    );
    expect(values).toEqual([0, 1, 5, 2, 3, 6, 4]);
  });
});
