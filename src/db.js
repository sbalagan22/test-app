// TEST FIXTURE — planted SQL injection + bugs for the scanner to flag.
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD, // Use environment variable for security
  database: "app"
});

// SQL INJECTION: user input concatenated directly into the query string.
function getUserByName(name) {
  // Fixed: Use parameterized queries to prevent SQL injection
  const query = "SELECT * FROM users WHERE name = ?";
  return connection.query(query, [name]);
}

// SQL INJECTION: template-literal interpolation of raw input.
function deleteOrder(orderId) {
  // Fixed: Use parameterized queries to prevent SQL injection
  return connection.query("DELETE FROM orders WHERE id = ?", [orderId]);
}

// BUG: off-by-one — loops one past the array end, returns undefined.
function lastThree(items) {
  const out = [];
  // Fixed: Adjust loop start to handle arrays shorter than 3 and loop end to prevent out-of-bounds access.
  for (let i = Math.max(0, items.length - 3); i < items.length; i++) {
    out.push(items[i]);
  }
  return out;
}

module.exports = { getUserByName, deleteOrder, lastThree };