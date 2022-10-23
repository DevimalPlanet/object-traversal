const Benchmark = require('benchmark');
const { _Stack, _Queue, _QueueToStackAdapter } = require('../dist');

console.log('\nStarting stack and queue bench');

console.time('Benching stack and queue took');
const startPower = 6;
const endPower = 7;
const base = 10;
for (let power = startPower; power < endPower; power++) {
  // setup
  let suite = new Benchmark.Suite();
  const benchResults = [];
  const iterations = base ** power;

  suite = suite.add(`\t_Stack`, function() {
    const stack = new _Stack();
    for (let i = 0; i < iterations; i++) {
      stack.push(1);
      stack.isEmpty();
      stack.pop();
      stack.isEmpty();
    }
  });

  suite = suite.add(`\t_Queue`, function() {
    const stack = new _Queue();
    for (let i = 0; i < iterations; i++) {
      stack.enqueue(1);
      stack.isEmpty();
      stack.dequeue();
      stack.isEmpty();
    }
  });

  suite = suite.add(`\t_QueueToStackAdapter`, function() {
    const stack = new _QueueToStackAdapter(new _Queue());
    for (let i = 0; i < iterations; i++) {
      stack.push(1);
      stack.isEmpty();
      stack.pop();
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
      const fastestName = suite
        .filter('fastest')
        .map('name')[0]
        .replace('\t', '');
      console.log(`Fastest is ${fastestName}\n`);
    })
    .run({ async: false });
}

console.timeEnd('Benching stack and queue took');
