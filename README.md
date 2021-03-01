# object-traversal

Simple, performant and customizable utility for traversing and applying callback functions to any portion of a javascript object.

## Installation

    npm i object-traversal

## Example usage

### Transform

```javascript
const { traverse } = require('object-traversal');

// dummy object
const example = {
  name: 'Hello World!',
  age: 1,
  accounts: 2,
  friends: 3,
};

// transformation function
function double(context) {
  const { parent, key, value, meta } = context;
  if (typeof value === 'number') {
    parent[key] = value * 2;
  }
}

// traverse and apply transform
traverse(example, double);
console.log(example);
// { name: 'Hello World!', age: 2, accounts: 4, friends: 6 }
```

### Find deep nested matches

<details><summary>See example</summary>

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
function findOver25(context) {
  const { parent, key, value, meta } = context;
  if (key === 'age' && value > 25) {
    valuesOver25.push(value);
  }
}

traverse(network, findOver25);

console.log(valuesOver25);
// [ 52, 42, 33 ]
```

</details>

### Find paths

<details><summary>See example</summary>

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

const pathToPeopleUnder30 = [];
function findPathToPeopleUnder30(context) {
  const { parent, key, value, meta } = context;
  if (typeof value.age === 'number' && value.age < 30) {
    pathToPeopleUnder30.push(meta.currentPath);
  }
}

traverse(network, findPathToPeopleUnder30);

console.log(pathToPeopleUnder30);
// [ 'friends.0', 'friends.1.friends.0' ]
```

</details>

## Benchmarks

Up to 15x faster than popular alternatives. `npm run benchmark`:

| Object size |         spec          | object-traversal ([npm](https://www.npmjs.com/package/object-traversal)) | traverse ([npm](https://www.npmjs.com/package/traverse)) |
| :---------: | :-------------------: | :----------------------------------------------------------------------: | :------------------------------------------------------: |
|    small    |   10 keys, depth 10   |                             141,300 ops/sec                              |                      21,241 ops/sec                      |
|   medium    |  100 keys, depth 100  |                              2,227 ops/sec                               |                       258 ops/sec                        |
|     big     | 1000 keys, depth 1000 |                              22.91 ops/sec                               |                       1.60 ops/sec                       |

## Planned

- [ ] Docs
- [ ] Configurable BFS/DFS
- [ ] Iterator support
- [ ] Max depth
- [ ] Timeouts
- [ ] Configurable path separator
- [ ] Utility for consuming paths
- [ ] Allow user to turn off cycle handler

## Built with

[TSDX](https://github.com/formium/tsdx)<br>
[np](https://github.com/sindresorhus/np)<br>
[yarn 1.22.10](https://yarnpkg.com/)
