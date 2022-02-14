const Benchmark = require('benchmark');
const { _Stack } = require('../dist');

console.log('Starting stack bench')
console.time('Benching stack took');
const startPower = 1;
const endPower = 5;
const base = 10;
for (let power = startPower; power < endPower; power++) {
  // setup
  let suite = new Benchmark.Suite();
  const benchResults = [];
  const iterations = base ** power;

  // add benchmarks
  suite = suite.add(`\tStack`, function() {
    const stack = new _Stack();
    for (let i = 0; i < iterations; i++) {
      stack.push(1);
      stack.isEmpty();
      stack.pop();
      stack.reset();
      stack.isEmpty();
    }
  });

  // run
  console.log(`10^${power} iterations`);
  suite
    // add listeners and run
    .on('cycle', function(event) {
      benchResults.push(String(event.target));
    })
    .on('complete', function() {
      console.log(benchResults.join('\n'));
    })
    .run({ async: false });
}

console.timeEnd('Benching stack took');
