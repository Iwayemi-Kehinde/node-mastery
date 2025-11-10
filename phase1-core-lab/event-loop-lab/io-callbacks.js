/**
 * ==========================================================
 * Node.js Core Lab  => io-callbacks.js
 * ----------------------------------------------------------
 * GOAL: Observe how Node executes callbacks during actual I/O.
 * Focus: nextTick, setImmediate, setTimeout inside I/O.
 * ==========================================================
 *
 * Run:
 * node io-callbacks.js
 *
 * ----------------------------------------------------------
 */

const fs = require('fs');

console.log("\n[SIMPLE I/O TEST]");

fs.readFile(__filename, () => {
  console.log("I/O callback started");

  setTimeout(() => console.log("setTimeout(0) inside I/O"), 0);
  setImmediate(() => console.log("setImmediate inside I/O"));
  process.nextTick(() => console.log("nextTick inside I/O"));

  console.log("I/O callback finished");
});

/*
Expected Output:
  I/O callback started
  I/O callback finished
  nextTick inside I/O
  setImmediate inside I/O
  setTimeout(0) inside I/O
Explanation:
  - nextTick always runs first inside any phase.
  - setImmediate is in the check phase (runs after I/O callbacks).
  - setTimeout(0) waits for the next timers phase.
*/

console.log("\n[MULTIPLE I/O CALLBACKS]");

fs.readFile(__filename, () => {
  console.log("I/O callback 1");

  process.nextTick(() => console.log("nextTick 1"));
  setImmediate(() => console.log("setImmediate 1"));
});

fs.readFile(__filename, () => {
  console.log("I/O callback 2");

  process.nextTick(() => console.log("nextTick 2"));
  setImmediate(() => console.log("setImmediate 2"));
});

/*
Expected Output:
  I/O callback 1
  I/O callback 2
  nextTick 1
  nextTick 2
  setImmediate 1
  setImmediate 2
Explanation:
  Node executes nextTicks inside each callback immediately after that callback.
  setImmediates are queued to run after the poll phase completes for all I/O.
*/

console.log("\n[NESTED TIMERS AND I/O]");
setTimeout(() => {
  console.log("Timer started");

  fs.readFile(__filename, () => {
    console.log("Nested I/O callback");

    process.nextTick(() => console.log("nextTick in nested I/O"));
    setImmediate(() => console.log("setImmediate in nested I/O"));
  });
}, 0);

console.log("\n I/O Experiment Complete, Observe Node scheduling!");
