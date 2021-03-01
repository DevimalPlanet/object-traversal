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

console.log(example);
// { name: 'Hello World!', age: 2, accounts: 4, friends: 6 }
