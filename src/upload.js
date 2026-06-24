// TEST FIXTURE — planted security flaws for the scanner to flag.
// Fake/placeholder values only. Nothing is live. Do not run.
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// PATH TRAVERSAL: user-controlled filename joined onto a base dir with no
// sanitization — "../../etc/passwd" escapes the uploads folder.
router.get("/download", (req, res) => {
  const file = req.query.file;
  const full = path.join(__dirname, "uploads", file);
  res.send(fs.readFileSync(full));
});

// ARBITRARY FILE WRITE: writes user content to a user-chosen path.
router.post("/save", (req, res) => {
  const { name, content } = req.body;
  fs.writeFileSync("uploads/" + name, content);
  res.send("saved");
});

// HARDCODED CREDENTIAL: fake storage password checked into source.
const STORAGE_PASSWORD = "changeme-please-1234";

module.exports = { router, STORAGE_PASSWORD };
