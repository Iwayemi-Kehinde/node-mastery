## Event Loop Lab Reflections

Hi! Welcome to my Event Loop Lab reflections.
I built this lab to understand how Node.js decides which piece of code runs first. Don’t worry if you’re new to JavaScript, I’ll explain everything step by step.

## 1. nextTick-vs-setImmediate.js

### What I Did
- Tested `process.nextTick()`
- Tested `setImmediate()`
- Mixed them with `setTimeout()`
- Watched the order in which Node ran them

### What I Learned
- `process.nextTick()` runs immediately after the current operation finishes.
- `setImmediate()` runs after the current event loop phase (check phase).
- Synchronous code (like `console.log("start")`) always runs first.

**Simple analogy:**
- `nextTick` => “Do it now!”
- `setImmediate` => “I’ll wait a tiny bit and then do it.”

Even if the code is inside a file read or other asynchronous task, `nextTick` always runs first.

---

## 2. promises-order.js

### What I Did
- Mixed Promises, `async/await`, and `process.nextTick()`
- Added `setTimeout()` and `setImmediate()`
- Observed how Node scheduled everything

### What I Learned
- Promises are a microtask queue, they run after `nextTick`.
- `await` pauses execution but allows other microtasks to run.
- Timers (`setTimeout`) run after all microtasks finish.
- `setImmediate` runs in the check phase (after I/O).

---

## 3. io-callbacks.js

### What I did
- Read the same file multiple times Added nextTick, setImmediate, setTimeout inside the read callbacks.
- Added nextTick, setImmediate, setTimeout inside the read callbacks

### What I learned:
- Inside I/O callbacks, Node still runs nextTick first. setImmediate always waits until Node finishes its I/O phase. 
- Multiple I/O callbacks are queued, and Node runs them in order.

--- 

### Plain analogy
 Imagine Node as a chef in a kitchen: 
 nextTick => taste the food immediately after cooking a dish 
 Promise => check the ingredients while tasting 
 setImmediate => clean the counter once the current dishes are done 
 setTimeout => set the timer for the oven and come back later

---

### Key Takeaways 
 - Synchronous code runs first. 
 - nextTick always beats Promises and timers. 
 - Promises run next, microtask style. 
 - setImmediate waits for the check phase (after I/O). 
 - setTimeout(0) is last in line, unless no I/O is happening.
 
 ---

 ### Why This Matters 

 Understanding this is the heart of Node.js. It explains why your async code sometimes runs in “weird” orders. It helps you avoid bugs when writing APIs, servers, or anything async. Even if you just started with const x = 6;

**Example:**
```js
console.log("start");
 process.nextTick(...) > runs first 
 Promise.then(...) > runs after nextTick 
 setTimeout(..., 0) > runs after microtasks 
 setImmediate(...) > runs at the end of the cycle 
 console.log("end") > runs immediately, synchronous