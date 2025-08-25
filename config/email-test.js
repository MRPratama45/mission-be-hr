const nodemailer = require('nodemailer');

// Create reusable transporter object using the default SMTP transport
const createTestTransporter = async () => {
  // Generate test SMTP service account from ethereal.email
  let testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

const sendTestEmail = async (to, subject, html) => {
  try {
    const transporter = await createTestTransporter();
    
    const info = await transporter.sendMail({
      from: '"Test App" <foo@example.com>',
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return info;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
};

module.exports = {
  createTestTransporter,
  sendTestEmail
};