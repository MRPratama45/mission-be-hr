require('dotenv').config();
const { verifyToken, generateToken } = require('./config/jwt');
const jwt = require("jsonwebtoken");


// Test token generation and verification
async function testToken() {
  try {
    const testPayload = {
      id: 1,
      email: 'test@example.com',
      purpose: 'email_verification',
      timestamp: Date.now()
    };

    console.log('Generating token with payload:', testPayload);
    
    // Generate token
    const token = generateToken(testPayload);
    console.log('Generated token:', token);
    
    // Verify token
    console.log('\nVerifying token...');
    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded);
    
    // Test expired token
    console.log('\nTesting expired token...');
    const expiredToken = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1ms' });
    
    // Tunggu sebentar agar token expired
    setTimeout(() => {
      try {
        verifyToken(expiredToken);
        console.log('Token should be expired but is not');
      } catch (error) {
        console.log('Correctly detected expired token:', error.message);
      }
    }, 10);
    
  } catch (error) {
    console.error('Token test error:', error);
  }
}

testToken();