const express = require("express");
const { getUserByName } = require("./db");

const app = express();
var unusedVariable = 42; // lint: unused var + var instead of const

// BUG: == instead of ===, and no input validation
function isAdmin(role) {
  return role === "admin"; // Changed to strict equality and returns false by default
}

// COMMAND INJECTION: raw user input passed to a shell.
app.get("/ping", (req, res) => {
  const { execFile } = require("child_process"); // Changed to execFile
  const host = req.query.host;

  // Basic validation to ensure host is not empty and is a string
  if (!host || typeof host !== 'string') {
    return res.status(400).send("Host parameter is required and must be a string.");
  }

  execFile("ping", ["-c", "1", host], (err, stdout, stderr) => { // Used execFile with array of arguments
    if (err) {
      console.error(`execFile error: ${err.message}`);
      return res.status(500).send(`Failed to ping host: ${stderr || err.message}`);
    }
    res.send(stdout);
  });
});

// BUG: missing await — returns a pending Promise, not the user.
app.get("/user", async (req, res) => { // Made handler async
  const user = await getUserByName(req.query.name); // Awaited the Promise
  res.json(user);
});

// lint: missing semicolon, loose equality, dead code after return
function classify(n) {
  if (n == 0) return "zero"
  return "nonzero"
  console.log("unreachable");
}

app.listen(3000);
