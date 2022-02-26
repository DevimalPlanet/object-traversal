# object-traversal

<div>

<a href="https://github.com/DevimalPlanet/object-traversal/actions/workflows/tests.yml">
  <img src="https://github.com/DevimalPlanet/object-traversal/actions/workflows/tests.yml/badge.svg" alt="License" />
</a>

<a href="https://codecov.io/gh/DevimalPlanet/object-traversal/branch/main/graph/badge.svg?token=JJOGZJEZBO">
  <img src="https://codecov.io/gh/DevimalPlanet/object-traversal/branch/main/graph/badge.svg?token=JJOGZJEZBO" alt="License" />
</a>

<a href="https://www.npmjs.com/package/object-traversal">
<img src="https://img.shields.io/npm/dm/object-traversal.svg" alt="npm downloads" />
</a>

<a href="https://github.com/DevimalPlanet/object-traversal/blob/master/package.json">
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="License" />
</a>

<a href="https://github.com/DevimalPlanet/object-traversal/blob/master/LICENSE">
  <img src="https://img.shields.io/github/license/DevimalPlanet/object-traversal.svg" alt="License" />
</a>

</div>

<br />

<div>
Flexible and performant utility for traversing javascript objects.
</div>

## Installation

    npm i object-traversal

## ✔ Features

1. Performance
   - Traverses over 20 million nodes per second. _(2020 MacBook Air)_
   - Around 10 times faster than popular alternatives. _(`npm run benchmark`)_
1. Configurable
   - Tweak `traversalOpts` for even more speed, traversal order, maxDepth and more.
1. Zero dependencies
   - Works on both NodeJS and the browser.
1. Big test coverage
1. Typescript

## Docs

### Usage

```javascript
import { traverse } from 'object-traversal';

traverse(object, callback, opts?);
```

### object

Any instance of javascript object, cyclic or otherwise.

### callback

A function that will be called once for each node in the provided root `object`, including the root `object` itself.

The `callback` function has the following signature:

```typescript
// Callback function signature
export type TraversalCallback = (context: TraversalCallbackContext) => any;

// Callback context
export type TraversalCallbackContext = {
  parent: ArbitraryObject | null; // parent is null when callback is being called on the root `object`
  key: string | null; // key is null when callback is being called on the root `object`
  value: any;
  meta: {
    nodePath?: string | null;
    visitedNodes: WeakSet<ArbitraryObject>;
    depth: number;
  };
};
```

### opts

An optional configuration object. See below for the available options and their default values.

```typescript
export type TraversalOpts = {
  /**
   * Default: 'depth-first'
   */
  traversalType?: 'depth-first' | 'breadth-first';

  /**
   * Traversal stops when the traversed node count reaches this value.
   *
   * Default: Number.Infinity
   */
  maxNodes?: number;

  /**
   * If set to `true`, prevents infinite loops by not re-visiting repeated nodes.
   *
   * Default: true
   */
  cycleHandling?: boolean;

  /**
   * The maximum depth that must be traversed.
   *
   * Root object has depth 0.
   *
   * Default: Number.Infinity
   */
  maxDepth?: number;

  /**
   * If true, traversal will stop as soon as the callback returns a truthy value.
   *
   * This is useful for search use cases, where you typically want to skip traversing the remaining nodes once the target is found.
   *
   * Default: false
   */
  haltOnTruthy?: boolean;

  /**
   * The string to be used as separator for the `meta.nodePath` segments.
   *
   * Set to null if you wish to turn off `meta.nodePath` to increase traversal speed.
   *
   * Default: '.'
   */
  pathSeparator?: string | null;
};
```

## Examples

### Double all numbers in-place

<details>
  <summary>Click to expand</summary>

```javascript
exampleObject = {
  name: 'Hello World!',
  age: 1,
  accounts: 2,
  friends: 3,
};
```

</details>

```javascript
function double({ parent, key, value, meta }) {
  if (typeof value === 'number') {
    parent[key] = value * 2;
  }
}

traverse(exampleObject, double);

console.log(exampleObject);
// {
//   name: 'Hello World!',
//   age: 2,
//   accounts: { checking: 4, savings: 6 },
//   friends: 8
// }
```

### Find deep nested values by criteria

<details>
  <summary>Click to expand</summary>

```javascript
network = {
  name: 'Person1',
  age: 52,
  friends: [
    {
      name: 'Person2',
      age: 25,
      friends: [],
    },
    {
      name: 'Person3',
      age: 42,
      friends: [
        {
          name: 'Person4',
          age: 18,
          friends: [
            {
              name: 'Person5',
              age: 33,
              friends: [],
            },
          ],
        },
      ],
    },
  ],
};
```

</details>

```javascript
const numbersOver25 = [];

function collectOver25({ parent, key, value, meta }) {
  if (key === 'age' && value > 25) {
    numbersOver25.push(value);
  }
}

traverse(network, collectOver25);

console.log(numbersOver25);
// [ 52, 42, 33 ]
```

### Find paths by criteria

<details>
  <summary>Click to expand</summary>

```javascript
network = {
  name: 'Alice Doe',
  age: 52,
  friends: [
    {
      name: 'John Doe',
      age: 25,
      friends: [],
    },
    {
      name: 'Bob Doe',
      age: 42,
      friends: [
        {
          name: 'John Smith',
          age: 18,
          friends: [
            {
              name: 'Charlie Doe',
              age: 33,
              friends: [],
            },
          ],
        },
      ],
    },
  ],
};
```

</details>

```javascript
const pathsToPeopleNamedJohn = [];

function callback({ parent, key, value, meta }) {
  if (value.name && value.name.startsWith('John')) {
    pathsToPeopleNamedJohn.push(meta.nodePath);
  }
}

traverse(network, callback);

console.log(pathsToPeopleNamedJohn);
// [ 'friends.0', 'friends.1.friends.0' ]
```

## Get node by path

<details>
  <summary>Click to expand</summary>

```javascript
network = {
  name: 'Alice Doe',
  age: 52,
  friends: [
    {
      name: 'John Doe',
      age: 25,
      friends: [],
    },
    {
      name: 'Bob Doe',
      age: 42,
      friends: [
        {
          name: 'John Smith',
          age: 18,
          friends: [
            {
              name: 'Charlie Doe',
              age: 33,
              friends: [],
            },
          ],
        },
      ],
    },
  ],
};
```

</details>

```javascript
import { getNodeByPath } from 'object-traversal';

const firstFriend = getNodeByPath(network, 'friends.0');
console.log(firstFriend);
// { name: 'John Doe', age: 25, friends: [] }
```

## Roadmap

- [x] Configurable BFS/DFS
- [x] Max depth
- [x] Configurable path separator
- [x] Utility for consuming paths
- [x] Toggleable cycle handler
- [ ] Iterator support
- [ ] Sequential promise support
- [ ] Multi threading & further speed enhancements
- [ ] Streaming research
- [ ] More granular cycleHandling: 'revisit', 'norevisit', and 'off'

## Built with

[TSDX](https://github.com/formium/tsdx)<br>
[np](https://github.com/sindresorhus/np)<br>
[yarn 1.22.10](https://yarnpkg.com/)
