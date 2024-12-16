const { parentPort } = require('worker_threads');

parentPort.on('message', (message) => {
  if (message === 'start') {
    // Simulate heavy computation
    let result = 0;
    for (let i = 0; i < 1e9; i++) {
      result += i;
    }
    parentPort.postMessage(result);
  }
});
