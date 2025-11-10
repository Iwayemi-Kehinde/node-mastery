/**
 * ==========================================================
 * Node.js Core Lab => promises-order.js
 * ----------------------------------------------------------
 * GOAL: Understand how Promises, async/await, process.nextTick(),
 * and timers interact inside Node's event loop microtask queue.
 * ==========================================================
 *
 * Run with:
 * node promises-order.js
 *
 * ----------------------------------------------------------
 */

console.log("\n[BASIC PROMISE VS NEXTTICK]");
console.log("Start");

process.nextTick(() => console.log("process.nextTick => executes first in microtask queue"));
Promise.resolve().then(() => console.log("Promise.then => runs after nextTick"));
setTimeout(() => console.log("setTimeout(0) => timer callback"), 0);
setImmediate(() => console.log("setImmediate => check phase callback"));

console.log("End");

/*
Expected Output:
  Start
  End
  process.nextTick → executes first in microtask queue
  Promise.then → runs after nextTick
  setTimeout(0) → timer callback
  setImmediate → check phase callback
*/

console.log("\n[CHAINED PROMISES & ASYNC/AWAIT]");
(async function testAsync() {
  console.log("Inside async function");
  
  setTimeout(() => console.log("Timer(0) inside async"), 0);
  process.nextTick(() => console.log("nextTick inside async"));
  
  await Promise.resolve().then(() => console.log("Promise.then before await complete"));
  
  console.log("After await (resumes on microtask queue)");
  
  await Promise.resolve().then(() => console.log("Promise.then after await"));
  
  console.log("End of async function");
})();

/*
Expected Output (roughly):
  Inside async function
  nextTick inside async
  Promise.then before await complete
  After await (resumes on microtask queue)
  Promise.then after await
  End of async function
  Timer(0) inside async
  setImmediate → (from previous)
Explanation:
  - Await breaks the function into microtasks, executed after current queue.
  - process.nextTick always wins priority in microtask queue.
  - Timers and immediates come in later phases.
*/

console.log("\n[COMPLEX NESTED PROMISES]");
Promise.resolve().then(() => {
  console.log("Promise 1");
  
  process.nextTick(() => console.log("nextTick inside Promise 1"));
  
  Promise.resolve().then(() => console.log("Promise 2 (nested)"));
  
  setTimeout(() => console.log("Timer(0) inside Promise"), 0);
});

console.log("\nExperiment Complete, Observe how async/await and Promises queue tasks!\n");
