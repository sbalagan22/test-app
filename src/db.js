// TEST FIXTURE — planted SQL injection + bugs for the scanner to flag.
const mysql = require("mysql");

// FIX: Replaced hardcoded credential with an environment variable.
// It is recommended to load sensitive information from environment variables or a secure configuration system.
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD, // FIX: Placeholder for environment variable; actual value should be loaded securely.
  database: "app",
});

// FIX: SQL INJECTION — User input is now passed as a parameter to connection.query,
// which properly escapes it, preventing SQL injection.
function getUserByName(name) {
  const query = "SELECT * FROM users WHERE name = ?";
  return connection.query(query, [name]);
}

// FIX: SQL INJECTION — User input is now passed as a parameter to connection.query,
// which properly escapes it, preventing SQL injection.
function deleteOrder(orderId) {
  return connection.query("DELETE FROM orders WHERE id = ?", [orderId]);
}

// FIX: BUG — Corrected off-by-one error and handled cases where the array has fewer than 3 elements.
// The loop now correctly iterates from the appropriate starting index up to (but not including) items.length.
function lastThree(items) {
  const out = [];
  for (let i = Math.max(0, items.length - 3); i < items.length; i++) {
    out.push(items[i]);
  }
  return out;
}

module.exports = { getUserByName, deleteOrder, lastThree };