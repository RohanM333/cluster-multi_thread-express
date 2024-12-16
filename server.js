const express = require('express');
const cluster = require('cluster');
const os = require('os');

// Determine the number of CPU cores
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for dying workers and replace them
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Starting a new worker...`);
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  const app = express();

  // Import the worker thread pool module
  const { Worker } = require('worker_threads');

  // Middleware to use worker threads for heavy computations
  const useWorkerThread = (workerFile, req, res) => {
    const worker = new Worker(workerFile);
    worker.on('message', result => res.send(`Result: ${result}`));
    worker.on('error', error => res.status(500).send(`Error: ${error.message}`));
    worker.postMessage('start');
  };

  // Example API endpoints using worker threads
  app.get('/', (req, res) => {
    res.send('Hello from worker ' + process.pid);
  });

  app.get('/compute1', (req, res) => {
    useWorkerThread('./compute1.js', req, res);
  });

  app.get('/compute2', (req, res) => {
    useWorkerThread('./compute2.js', req, res);
  });

  app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
