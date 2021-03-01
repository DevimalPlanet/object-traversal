const { traverse } = require('../dist');

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
