#!/usr/bin/env node

/**
 * Script để generate secrets cho .env file
 * Chạy: node generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 === Generated Secrets for .env file === 🔐\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);

// Generate Session Secret
const sessionSecret = crypto.randomBytes(32).toString('hex');
console.log('SESSION_SECRET=' + sessionSecret);

console.log('\n✅ Copy các secrets trên vào file .env của bạn!\n');
console.log('💡 Tip: Mỗi lần chạy script này sẽ tạo ra secrets mới.\n');

