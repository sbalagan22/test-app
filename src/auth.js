// TEST FIXTURE — planted security vulnerabilities for the scanner to flag.
// Every "secret" here is a fake/placeholder. Nothing is live. Do not run.
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// HARDCODED SECRET: signing key checked straight into source.
const JWT_SECRET = "supersecret123";

// HARDCODED CREDENTIALS: fake admin password embedded in code.
const ADMIN_PASSWORD = "admin";

// WEAK CRYPTO: MD5 is broken for password hashing and has no salt.
function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

// INSECURE COMPARISON: non-constant-time string compare leaks timing.
function checkPassword(input, expected) {
  return input == expected;
}

// AUTH BYPASS: signature verification disabled — any token is trusted.
function verifyToken(token) {
  return jwt.decode(token); // BUG: decode() does NOT verify the signature.
}

// SSRF: fetches an arbitrary user-supplied URL with no allow-list.
async function fetchProfile(url) {
  const res = await fetch(url);
  return res.json();
}

// INSECURE RANDOM: Math.random() is not cryptographically secure for tokens.
function generateResetToken() {
  return Math.random().toString(36).slice(2);
}

// SENSITIVE DATA IN LOGS: logging the raw password on every login attempt.
function login(username, password) {
  console.log(`Login attempt: user=${username} password=${password}`);
  if (password === ADMIN_PASSWORD) {
    return jwt.sign({ user: username, admin: true }, JWT_SECRET);
  }
  return null;
}

module.exports = {
  hashPassword,
  checkPassword,
  verifyToken,
  fetchProfile,
  generateResetToken,
  login,
};
