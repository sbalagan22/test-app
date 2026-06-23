// TEST FIXTURE — planted lint errors + logic bugs.
const express = require("express");
const { getUserByName } = require("./db");

const app = express();
var unusedVariable = 42; // lint: unused var + var instead of const

// BUG: == instead of ===, and no input validation
function isAdmin(role) {
  if (role == "admin") {
    return true;
  }
}

// COMMAND INJECTION: raw user input passed to a shell.
app.get("/ping", (req, res) => {
  const { exec } = require("child_process");
  exec("ping -c 1 " + req.query.host, (err, stdout) => {
    res.send(stdout);
  });
});

// BUG: missing await — returns a pending Promise, not the user.
app.get("/user", (req, res) => {
  const user = getUserByName(req.query.name);
  res.json(user);
});

// lint: missing semicolon, loose equality, dead code after return
function classify(n) {
  if (n == 0) return "zero"
  return "nonzero"
  console.log("unreachable");
}

app.listen(3000);
