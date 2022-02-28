/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { traverse, getNodeByPath } = require('../dist');
/**
 * EXAMPLE: Double
 */
exampleObject = {
  name: 'Hello World!',
  age: 1,
  accounts: {
    checking: 2,
    savings: 3,
  },
  friends: 4,
};

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

/**
 * EXAMPLE: Find deep nested matches
 */
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

const numbersOver25 = [];

function collectOver25({ parent, key, value, meta }) {
  if (key === 'age' && value > 25) {
    numbersOver25.push(value);
  }
}

traverse(network, collectOver25);

console.log(numbersOver25);
// [ 52, 42, 33 ]

/**
 * EXAMPLE: Find paths
 */
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

const pathsToPeopleNamedJohn = [];

function callback({ parent, key, value, meta }) {
  if (value.name && value.name.startsWith('John')) {
    pathsToPeopleNamedJohn.push(meta.nodePath);
  }
}

traverse(network, callback);

console.log(pathsToPeopleNamedJohn);
// [ 'friends.0', 'friends.1.friends.0' ]

/**
 * EXAMPLE: Get node by path
 */
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

const firstFriend = getNodeByPath(network, 'friends.0');
console.log(firstFriend);
// { name: 'John Doe', age: 25, friends: [] }

/**
 * EXAMPLE: Traverse in breadth frist order
 */
network = {
  name: 'Person 1',
  age: 52,
  friends: [
    {
      name: 'Person 2',
      age: 42,
      friends: [
        {
          name: 'Person 4',
          age: 18,
          friends: [],
        },
      ],
    },
    {
      name: 'Person 3',
      age: 25,
      friends: [],
    },
  ],
};

let names = [];

function getName({ parent, key, value, meta }) {
  if (value.name) {
    names.push(value.name);
  }
}

traverse(network, getName, { traversalType: 'breadth-first' });

console.log(names);
// [ 'Person 1', 'Person 2', 'Person 3', 'Person 4' ]
