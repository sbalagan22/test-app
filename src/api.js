// TEST FIXTURE — planted security flaws for the scanner to flag.
// Fake/placeholder values only. Nothing is live. Do not run.
const express = require("express");
const https = require("https");
const crypto = require("crypto");

const router = express.Router();

// XSS: reflects unescaped user input straight into the HTML response.
router.get("/hello", (req, res) => {
  res.send("<h1>Hello " + req.query.name + "</h1>");
});

// PROTOTYPE POLLUTION: merges untrusted body into an object recursively.
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === "object") {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// DISABLED TLS VERIFICATION: accepts any cert, enabling MITM.
function fetchInsecure(url) {
  return https.get(url, { rejectUnauthorized: false });
}

// WEAK HASH FOR SIGNATURES: SHA-1 is collision-broken.
function sign(data) {
  return crypto.createHash("sha1").update(data).digest("hex");
}

// NO RATE LIMITING + UNBOUNDED LOOP: trivially DoS-able.
router.post("/bulk", (req, res) => {
  const items = req.body.items;
  for (let i = 0; i <= items.length; i++) {
    process(items[i]); // BUG: off-by-one, calls process(undefined) on last iter
  }
  res.send("ok");
});

function process(item) {
  return item;
}

module.exports = { router, merge, fetchInsecure, sign };
