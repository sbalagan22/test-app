/**
 * Vulnerabilities and Security Risks Demo
 * 
 * This file contains textbook examples of common security vulnerabilities
 * for educational, testing, or static analysis (SAST) demonstration purposes.
 * Each section demonstrates the vulnerable code, explains the risk,
 * and provides the secure remediation pattern.
 */

const express = require('express');
const mysql = require('mysql2'); // Mock DB client for demonstration
const app = express();

// ==========================================
// 1. HARDCODED CREDENTIALS (SENSITIVE DATA EXPOSURE)
// ==========================================

// ❌ VULNERABLE: Storing API keys or credentials directly in source code.
// Risk: Credentials can be leaked via source control repositories (e.g., public GitHub).
const API_KEY = "3a9c4b8e2f1d0c7a5b3e2f1d0c7a5b3e";

//  SECURE REMEDIATION:
// Load credentials from environment variables or a secure vault at runtime.
const SECURE_API_KEY = process.env.API_KEY;


// ==========================================
// 2. SQL INJECTION (SQLi)
// ==========================================

// ❌ VULNERABLE: Concatenating raw user input directly into a database query.
// Risk: Attackers can input SQL syntax (e.g., "' OR '1'='1") to bypass authentication or access unauthorized data.
app.get('/user/profile-vulnerable', (req, res) => {
    const userId = req.query.id;
    const query = `SELECT * FROM users WHERE id = '${userId}'`;
    
    // Simulating database query execution
    console.log(`Executing vulnerable query: ${query}`);
    res.send("Query executed.");
});

//  SECURE REMEDIATION:
// Use parameterized queries (prepared statements) to separate query logic from data.
app.get('/user/profile-secure', (req, res) => {
    const userId = req.query.id;
    
    // Parameterized query using placeholders (?)
    const query = 'SELECT * FROM users WHERE id = ?';
    console.log(`Executing secure query: ${query} with param [${userId}]`);
    res.send("Secure query executed.");
});


// ==========================================
// 3. REFLECTED CROSS-SITE SCRIPTING (XSS)
// ==========================================

// ❌ VULNERABLE: Directly embedding user input into HTML output without sanitation or escaping.
// Risk: Attackers can execute arbitrary JavaScript in the victim's browser context (e.g., stealing cookies).
app.get('/search-vulnerable', (req, res) => {
    const searchTerms = req.query.q;
    // Sending unescaped user input back to browser
    res.send(`<h1>Search Results for: ${searchTerms}</h1>`);
});

//  SECURE REMEDIATION:
// Properly sanitize or entity-encode user input before rendering it in the UI.
app.get('/search-secure', (req, res) => {
    const searchTerms = req.query.q || '';
    
    // Basic HTML escaping helper
    const escapeHtml = (text) => {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const safeSearchTerms = escapeHtml(searchTerms);
    res.send(`<h1>Search Results for: ${safeSearchTerms}</h1>`);
});

app.listen(3000, () => {
    console.log('Vulnerability demo app listening on port 3000');
});
