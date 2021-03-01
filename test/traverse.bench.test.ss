/**
 * @jest-environment node
 */

import * as Benchmark from 'benchmark';
import { traverse } from '../src';

const smallSizeObject: any = {};
const midSizeObject: any = {};
const largeSizeObject: any = {};
const hugeSizeObject: any = {};
const largeCyclicObject: any = {};

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

const suite = new Benchmark.Suite();
const benchResults: string[] = [];
let counter = 0;
const callback = () => counter++;

// add tests
suite
  .add('smallSizedObject', function() {
    traverse(smallSizeObject, callback);
  })
  .add('midSizeObject', function() {
    traverse(midSizeObject, callback);
  })
  .add('largeSizeObject', function() {
    traverse(largeSizeObject, callback);
  })
  .add('hugeSizeObject', function() {
    traverse(hugeSizeObject, callback);
  })
  .add('largeCyclicObject', function() {
    traverse(largeCyclicObject, callback);
  })
  // add listeners
  .on('cycle', function(event: any) {
    benchResults.push(String(event.target));
  })
  // .on('complete', function() {
  //   console.log('Fastest is ' + suite.filter('fastest').map('name'));
  // })
  // run async
  .run({ async: false });

describe('traverse benchmark', () => {
  it('benchmarks', () => {
    benchResults.push(`\nchecked ${counter} keys`);
    console.log(benchResults.join('\n'));
  });
});
