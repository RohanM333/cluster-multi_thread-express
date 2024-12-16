const { parentPort } = require('worker_threads');

parentPort.on('message', (message) => {
  if (message === 'start') {
    // Simulate heavy computation
    let result = 1;
    for (let i = 1; i < 1e6; i++) {
      result *= i;
    }
    parentPort.postMessage(result);
  }
});
