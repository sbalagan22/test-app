/**
 * Vulnerabilities and Security Risks Demo - Part 2
 * 
 * This file contains textbook examples of additional common security vulnerabilities
 * for educational, testing, or static analysis (SAST) demonstration purposes.
 * Each section demonstrates the vulnerable code, explains the risk,
 * and provides the secure remediation pattern.
 */

const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// ==========================================
// 1. COMMAND INJECTION
// ==========================================

// ❌ VULNERABLE: Direct concatenation of user input into a shell command wrapper.
// Risk: Attackers can append additional commands (e.g., via ';' or '&&') that execute with application privileges.
app.post('/ping-vulnerable', (req, res) => {
    const ipAddress = req.body.ip;
    const command = `ping -c 1 ${ipAddress}`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(stderr);
        }
        res.send(stdout);
    });
});

//  SECURE REMEDIATION:
// Avoid shell execution entirely, or use APIs that do not spawn a shell and pass arguments as an array.
app.post('/ping-secure', (req, res) => {
    const ipAddress = req.body.ip;
    const { execFile } = require('child_process');
    
    // Validate input format (e.g., ensure it's a valid IP address)
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
        return res.status(400).send("Invalid IP address format.");
    }
    
    // execFile does not invoke a shell, passing arguments as a safe array
    execFile('ping', ['-c', '1', ipAddress], (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(stderr);
        }
        res.send(stdout);
    });
});


// ==========================================
// 2. PATH TRAVERSAL (ARBITRARY FILE READ)
// ==========================================

// ❌ VULNERABLE: Using unvalidated user input to resolve file paths.
// Risk: Attackers can use path traversal sequences (e.g., '../../etc/passwd') to read sensitive files.
app.get('/read-vulnerable', (req, res) => {
    const filename = req.query.file;
    const filePath = path.join(__dirname, 'public', filename);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send("File not found");
        }
        res.send(data);
    });
});

//  SECURE REMEDIATION:
// Sanitize input, use a strict whitelist of permitted files, or verify that the resolved path stays within the intended directory.
app.get('/read-secure', (req, res) => {
    const filename = req.query.file;
    
    // 1. Sanitize input to only allow alphanumeric filenames
    if (!/^[a-zA-Z0-9_\-\.]+$/.test(filename)) {
        return res.status(400).send("Invalid filename format.");
    }
    
    const baseDir = path.join(__dirname, 'public');
    const filePath = path.resolve(baseDir, filename);
    
    // 2. Verify the resolved path is inside the allowed directory
    if (!filePath.startsWith(baseDir)) {
        return res.status(403).send("Access Denied");
    }
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send("File not found");
        }
        res.send(data);
    });
});


// ==========================================
// 3. INSECURE DESERIALIZATION (UNSAFE EVAL)
// ==========================================

// ❌ VULNERABLE: Executing raw user-controlled strings as code using eval() or Function().
// Risk: Remote Code Execution (RCE) where attackers can execute arbitrary JS payload inside the server process.
app.post('/calculate-vulnerable', (req, res) => {
    const expression = req.body.expr;
    try {
        // eval executes any JavaScript code inside the string
        const result = eval(expression);
        res.json({ result });
    } catch (e) {
        res.status(400).send("Invalid expression");
    }
});

//  SECURE REMEDIATION:
// Use safe, specialized parsing libraries (like mathjs) or strict parsing logic instead of executing code.
app.post('/calculate-secure', (req, res) => {
    const expression = req.body.expr;
    
    // Strict regular expression allowing only numbers and basic mathematical operators
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
        return res.status(400).send("Forbidden characters in expression");
    }
    
    try {
        // Safe evaluation (using Function constructor only on validated, safe characters)
        const safeEval = new Function(`return (${expression})`);
        res.json({ result: safeEval() });
    } catch (e) {
        res.status(400).send("Invalid expression");
    }
});

app.listen(3000);
