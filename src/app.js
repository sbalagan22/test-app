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
  const { execFile } = require("child_process"); // Changed to execFile
  const host = req.query.host;

  // Input validation: Ensure the host is a valid hostname or IP address.
  // This is a basic example; a more comprehensive regex or library might be needed.
  if (!host || !/^[a-zA-Z0-9.-]+$/.test(host)) {
    return res.status(400).send("Invalid host provided.");
  }

  // Use execFile to run the command with arguments passed as an array,
  // preventing shell interpretation of the host variable.
  execFile("ping", ["-c", "1", host], (err, stdout, stderr) => {
    if (err) {
      console.error(`execFile error for host ${host}: ${stderr || err.message}`);
      return res.status(500).send(`Failed to ping host: ${host}. Error: ${stderr || err.message}`);
    }
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
