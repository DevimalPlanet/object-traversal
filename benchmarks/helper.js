function createBenchMock(objectSizes = 10, objectDepth = 10, cyclic = true) {
  const mocks = [];
  for (let d = 0; d < objectDepth; d++) {
    const benchMock = {};
    for (let i = 0; i < objectSizes; i++) {
      benchMock[i] = i;
    }
    mocks.push(benchMock);
  }

  const rootMock = mocks[0];
  for (let index = 0; index < mocks.length; index++) {
    const mock = mocks[index];
    mock[objectSizes + index] = mocks[index + 1];

    if (cyclic) {
      mock[objectSizes + index + 2] = rootMock;
    }
  }

  return rootMock;
}

module.exports = { createBenchMock };
