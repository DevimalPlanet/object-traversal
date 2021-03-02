const Benchmark = require('benchmark');
const { traverse: object_traversal } = require('../dist');
const traverse = require('traverse');
const { createBenchMock } = require('./helper');

console.time('Benching took');
const mocks = {
  bench10x10WithCycles: createBenchMock(10, 10, true),
  bench100x100WithCycles: createBenchMock(100, 100, false, true),
  bench1000x1000WithCycles: createBenchMock(1000, 1000, true),
};

for (const key in mocks) {
  // setup
  let suite = new Benchmark.Suite();
  const benchResults = [];
  let counter = 0;
  const callback = () => {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    counter++;
  };

  // add benchmarks
  suite = suite.add(`\tobject-traversal`, function() {
    object_traversal(mocks[key], callback);
  });

  suite = suite.add(`\ttraverse`, function() {
    traverse(mocks[key]).forEach(callback);
  });

  // run
  console.log(`${key}`);
  suite
    // add listeners and run
    .on('cycle', function(event) {
      benchResults.push(String(event.target));
    })
    .on('complete', function() {
      console.log(benchResults.join('\n'));
      const fastestName = suite
        .filter('fastest')
        .map('name')[0]
        .replace('\t', '');
      console.log(`Fastest is ${fastestName}\n`);
    })
    .run({ async: false });
}

console.timeEnd('Benching took');
