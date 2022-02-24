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
Simple, performant and configurable utility for traversing and applying callback functions to any portion of a javascript object.
</div>

## Installation

    npm i object-traversal

## Example usage

### Transform

```javascript
const { traverse } = require('object-traversal');

const example = {
  name: 'Hello World!',
  age: 1,
  accounts: 2,
  friends: 3,
};

traverse(example, context => {
  const { parent, key, value, meta } = context;
  if (typeof value === 'number') {
    parent[key] = value * 2;
  }
});

// { name: 'Hello World!', age: 2, accounts: 4, friends: 6 }
```

### Find deep nested matches

```javascript
const { traverse } = require('object-traversal');

const network = {
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

const valuesOver25 = [];

traverse(network, context => {
  const { parent, key, value, meta } = context;
  if (key === 'age' && value > 25) {
    valuesOver25.push(value);
  }
});

console.log(valuesOver25);
// [ 52, 42, 33 ]
```

### Find paths

```javascript
const { traverse } = require('object-traversal');

const network = {
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

const pathToPeopleNamedJohn = [];

traverse(network, context => {
  const { parent, key, value, meta } = context;
  if (value.name && value.name.startsWith('John')) {
    pathToPeopleNamedJohn.push(meta.nodePath);
  }
});

console.log(pathToPeopleNamedJohn);
// [ 'friends.0', 'friends.1.friends.0' ]
```

## Benchmarks

Up to 15x faster than popular alternatives. `npm run benchmark`:

| Object size |         spec          | object-traversal ([npm](https://www.npmjs.com/package/object-traversal)) | traverse ([npm](https://www.npmjs.com/package/traverse)) |
| :---------: | :-------------------: | :----------------------------------------------------------------------: | :------------------------------------------------------: |
|    small    |   10 keys, depth 10   |                             141,300 ops/sec                              |                      21,241 ops/sec                      |
|   medium    |  100 keys, depth 100  |                              2,227 ops/sec                               |                       258 ops/sec                        |
|     big     | 1000 keys, depth 1000 |                              22.91 ops/sec                               |                       1.60 ops/sec                       |

## Planned

- [ ] Docs
- [x] Configurable BFS/DFS
- [ ] Iterator support
- [x] Max depth
- [ ] Timeouts
- [ ] Configurable path separator
- [ ] Utility for consuming paths
- [x] Allow user to turn off cycle handler

## Built with

[TSDX](https://github.com/formium/tsdx)<br>
[np](https://github.com/sindresorhus/np)<br>
[yarn 1.22.10](https://yarnpkg.com/)
