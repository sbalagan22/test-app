// TEST FIXTURE — planted security flaws for the scanner to flag.
// Fake/placeholder values only. Nothing is live. Do not run.
const express = require("express");
const { exec } = require("child_process");

const router = express.Router();

// COMMAND INJECTION: user input interpolated straight into a shell command.
router.get("/receipt", (req, res) => {
  const id = req.query.id;
  exec("cat receipts/" + id + ".txt", (err, stdout) => {
    res.send(stdout);
  });
});

// SQL INJECTION: raw user input concatenated into the query string.
function chargeUser(db, userId, amount) {
  const query =
    "UPDATE accounts SET balance = balance - " +
    amount +
    " WHERE id = " +
    userId;
  return db.query(query);
}

// IDOR / MISSING AUTHZ: any caller can refund any order, no ownership check.
router.post("/refund", (req, res) => {
  const { orderId } = req.body;
  processRefund(orderId);
  res.send("refunded");
});

// HARDCODED CREDENTIAL: fake webhook secret checked into source.
const PAYMENT_WEBHOOK_SECRET = "test-secret-do-not-use";

function processRefund(orderId) {
  // BUG: no validation that orderId exists or belongs to the requester.
  return orderId;
}

module.exports = { router, chargeUser, PAYMENT_WEBHOOK_SECRET };
