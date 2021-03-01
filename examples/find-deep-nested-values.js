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
