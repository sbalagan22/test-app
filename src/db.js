// TEST FIXTURE — planted SQL injection + bugs for the scanner to flag.
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hunter2", // hardcoded credential — planted
  database: "app",
});

// SQL INJECTION: user input concatenated directly into the query string.
function getUserByName(name) {
  const query = "SELECT * FROM users WHERE name = '" + name + "'";
  return connection.query(query);
}

// SQL INJECTION: template-literal interpolation of raw input.
function deleteOrder(orderId) {
  return connection.query(`DELETE FROM orders WHERE id = ${orderId}`);
}

// BUG: off-by-one — loops one past the array end, returns undefined.
function lastThree(items) {
  const out = [];
  for (let i = items.length - 3; i <= items.length; i++) {
    out.push(items[i]);
  }
  return out;
}

module.exports = { getUserByName, deleteOrder, lastThree };
