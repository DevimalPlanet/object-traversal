const Benchmark = require('benchmark');
const { traverse } = require('../dist');
const {
  smallSizeObject,
  midSizeObject,
  largeSizeObject,
  hugeSizeObject,
  largeCyclicObject,
} = require('./helper');

const suite = new Benchmark.Suite();
const benchResults = [];
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
  .on('cycle', function(event) {
    benchResults.push(String(event.target));
  })
  // .on('complete', function() {
  //   console.log('Fastest is ' + suite.filter('fastest').map('name'));
  // })
  // run async
  .run({ async: false });

console.log(benchResults.join('\n'));
