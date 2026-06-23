// TEST FIXTURE — planted fake secrets. All values are documented dummies, not live.

// AWS documented example credentials (from AWS's own docs — not a real account)
const AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// Obvious placeholder tokens — not real
const GITHUB_TOKEN = "ghp_FAKEFAKEFAKEFAKEFAKEFAKEFAKEFAKE0000";
const STRIPE_SECRET_KEY = "sk_test_FAKE000000000000000000000000";
const DB_PASSWORD = "hunter2";

// Hardcoded private key block (obviously fake filler, not a real key)
const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA_FAKE_TEST_FIXTURE_NOT_A_REAL_KEY_0000000000000000
-----END RSA PRIVATE KEY-----`;

module.exports = {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  GITHUB_TOKEN,
  STRIPE_SECRET_KEY,
  DB_PASSWORD,
  PRIVATE_KEY,
};
