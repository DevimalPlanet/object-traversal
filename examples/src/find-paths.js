/* eslint-disable @typescript-eslint/no-unused-vars */

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
