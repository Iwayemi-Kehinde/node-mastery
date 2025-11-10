/**
 * ==========================================================
 * Node.js Core Lab => nextTick-vs-setImmediate.js
 * ----------------------------------------------------------
 * GOAL: Visualize and understand the execution order between
 * process.nextTick() and setImmediate() across different contexts.
 * ==========================================================
 * 
 * KEY IDEA:
 * - process.nextTick() runs before the event loop continues.
 * - setImmediate() runs in the CHECK phase (after I/O).
 *
 * Run this file multiple times to observe differences:
 *    node nextTick-vs-setImmediate.js
 *
 * ----------------------------------------------------------
 */

const fs = require('fs');

// =============== Basic Microtask vs Event Loop ===============
console.log("\n[BASIC TEST]");
console.log("Start");

setImmediate(() => console.log("setImmediate - runs after the event loop CHECK phase"));
setTimeout(() => console.log("setTimeout(0) - runs in the next TIMERS phase"), 0);
process.nextTick(() => console.log("process.nextTick - runs before event loop continues"));
Promise.resolve().then(() => console.log("Promise.then - runs after nextTick but before timers"));

console.log("End");

/*
Expected Output (most runs):
  Start
  End
  process.nextTick - runs before event loop continues
  Promise.then - runs after nextTick but before timers
  setTimeout(0) - runs in the next TIMERS phase
  setImmediate - runs after the event loop CHECK phase
*/

// =============== With I/O (fs.readFile) ===============
console.log("\n[INSIDE I/O CALLBACK]");
fs.readFile(__filename, () => {
  process.nextTick(() => console.log("I/O - nextTick"));
  setImmediate(() => console.log("I/O - setImmediate"));
});

/*
Expected Output:
  I/O - setImmediate
  I/O - nextTick
Explanation:
  Once inside an I/O callback, the CHECK phase (where setImmediate runs)
  happens *before* the next TIMERS phase, so setImmediate runs first.
*/

// =============== Nested Contexts ===============
console.log("\n[NESTED CALLBACKS]");
setImmediate(() => {
  console.log("Outer setImmediate");
  process.nextTick(() => console.log("nextTick inside setImmediate"));
  setImmediate(() => console.log("Inner setImmediate"));
});

/*
Expected Output:
  Outer setImmediate
  nextTick inside setImmediate
  Inner setImmediate
Explanation:
  Each nextTick executes before the event loop moves to the next phase.
  So even inside a setImmediate, the nextTick executes immediately before
  the next CHECK phase.
*/

console.log("\n Experiment Complete, Observe how execution order changes!\n");
