const smallSizeObject = {};
const midSizeObject = {};
const largeSizeObject = {};
const hugeSizeObject = {};
const largeCyclicObject = {};

const FACTOR = 10;
const smallNumberOfKeys = FACTOR;
const midNumberOfKeys = FACTOR ** 2;
const largeNumberOfKeys = FACTOR ** 3;
const hugeNumberOfKeys = FACTOR ** 4;

for (let i = 0; i < smallNumberOfKeys; i++) {
  smallSizeObject[i] = i;
}

for (let i = 0; i < midNumberOfKeys; i++) {
  midSizeObject[i] = { ...smallSizeObject };
}

for (let i = 0; i < largeNumberOfKeys; i++) {
  largeSizeObject[i] = { ...smallSizeObject };
}

for (let i = 0; i < hugeNumberOfKeys; i++) {
  hugeSizeObject[i] = { ...smallSizeObject };
}

for (let i = 0; i < largeNumberOfKeys; i++) {
  largeCyclicObject[i] = {
    ...smallSizeObject,
    largeCyclicObject,
    smallSizeObject: largeCyclicObject[i - 1],
  };
}

module.exports = {
  smallSizeObject,
  midSizeObject,
  largeSizeObject,
  hugeSizeObject,
  largeCyclicObject,
};
