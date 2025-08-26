const sendEmail = async (to, subject, html) => {
  console.log('=== EMAIL MOCK ===');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('HTML:', html);
  console.log('==================');
  
  return { messageId: 'mock-message-id' };
};

const sendVerificationEmail = async (user, token) => {
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
  console.log('Verification link generated:', verificationLink);

  const html = `
    <h1>Email Verification</h1>
    <p>Hello ${user.name},</p>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
  `;
  
  console.log('=== VERIFICATION EMAIL MOCK ===');
  console.log('User:', user.email);
  console.log('Verification Link:', verificationLink);
  console.log('================================');
  
  return await sendEmail(user.email, 'Verify Your Email', html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail
};