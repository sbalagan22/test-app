// TEST FIXTURE — planted security flaws for the scanner to flag.
// Fake/placeholder values only. Nothing is live. Do not run.
const express = require("express");
const vm = require("vm");

const router = express.Router();

// CODE INJECTION: evaluates raw user input as JavaScript.
router.post("/calc", (req, res) => {
  const result = eval(req.body.expr);
  res.json({ result });
});

// SANDBOX ESCAPE: runs untrusted input through vm with no isolation.
router.post("/run", (req, res) => {
  res.json({ out: vm.runInThisContext(req.body.code) });
});

// OPEN REDIRECT: redirects to a user-supplied URL with no allow-list.
router.get("/go", (req, res) => {
  res.redirect(req.query.next);
});

// PREDICTABLE SESSION ID: sequential counter, trivially guessable.
let counter = 0;
function newSessionId() {
  counter += 1;
  return "sess-" + counter;
}

// REGEX DOS: catastrophic backtracking on attacker-controlled input.
function isValidEmail(email) {
  return /^([a-zA-Z0-9]+)+@example\.com$/.test(email);
}

module.exports = { router, newSessionId, isValidEmail };
