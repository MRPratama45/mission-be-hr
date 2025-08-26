require('dotenv').config();
const { generateToken, verifyToken } = require('./config/jwt');

// Test token
const testPayload = {
  id: 1,
  email: 'test@example.com',
  purpose: 'email_verification',
  timestamp: Date.now()
};

console.log('Testing token generation and verification...');
console.log('Payload:', testPayload);

const token = generateToken(testPayload);
console.log('Generated token:', token);

try {
  const decoded = verifyToken(token);
  console.log('Decoded token:', decoded);
  console.log('Token verification: SUCCESS');
} catch (error) {
  console.log('Token verification: FAILED', error.message);
}