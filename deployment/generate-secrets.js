#!/usr/bin/env node

/**
 * Generate Strong Production Secrets
 * Transportation Management System
 * 
 * Usage: node generate-secrets.js
 * 
 * Generates cryptographically secure random strings for:
 * - JWT_SECRET
 * - JWT_REFRESH_SECRET
 * - SESSION_SECRET
 * - PAYMENT_WEBHOOK_SECRET
 */

const crypto = require('crypto');

console.log('\n=============================================================================');
console.log('🔐 PRODUCTION SECRETS GENERATOR');
console.log('Transportation Management System');
console.log('=============================================================================\n');

console.log('⚠️  IMPORTANT: Copy these secrets to your .env file or Render dashboard');
console.log('⚠️  NEVER commit these secrets to version control\n');

// Generate secrets
const secrets = {
  JWT_SECRET: crypto.randomBytes(64).toString('hex'),
  JWT_REFRESH_SECRET: crypto.randomBytes(64).toString('hex'),
  SESSION_SECRET: crypto.randomBytes(64).toString('hex'),
  PAYMENT_WEBHOOK_SECRET: crypto.randomBytes(32).toString('hex')
};

console.log('-----------------------------------------------------------------------------');
console.log('GENERATED SECRETS (copy these to your production environment):');
console.log('-----------------------------------------------------------------------------\n');

for (const [key, value] of Object.entries(secrets)) {
  console.log(`${key}=${value}\n`);
}

console.log('-----------------------------------------------------------------------------');
console.log('USAGE IN RENDER:');
console.log('-----------------------------------------------------------------------------');
console.log('1. Go to Render Dashboard → Your Web Service');
console.log('2. Click "Environment" in the left sidebar');
console.log('3. Click "Add Environment Variable"');
console.log('4. Paste each key-value pair above');
console.log('5. Click "Save Changes"\n');

console.log('-----------------------------------------------------------------------------');
console.log('USAGE IN RAILWAY:');
console.log('-----------------------------------------------------------------------------');
console.log('1. Go to Railway Dashboard → Your Project');
console.log('2. Click "Variables" tab');
console.log('3. Click "New Variable"');
console.log('4. Paste each key-value pair above');
console.log('5. Click "Add"\n');

console.log('-----------------------------------------------------------------------------');
console.log('SECURITY BEST PRACTICES:');
console.log('-----------------------------------------------------------------------------');
console.log('✅ Each secret is 128-256 bits of entropy (cryptographically secure)');
console.log('✅ Use different secrets for each environment (dev, staging, production)');
console.log('✅ Rotate secrets periodically (every 90 days recommended)');
console.log('✅ Store secrets in a secure password manager');
console.log('✅ Never log or expose secrets in error messages');
console.log('✅ Use environment variables, never hardcode secrets\n');

console.log('=============================================================================\n');
