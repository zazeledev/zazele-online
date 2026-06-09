require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function testMail() {
  console.log('Attempting to send test email...');
  console.log('Config:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: '********' // Hide password
  });

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SCHOOL_NAME}" <${process.env.EMAIL_FROM}>`,
      to: 'bafanabnd@gmail.com',
      subject: 'Test Email - Zazele Online',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<b>This is a test email to verify SMTP configuration.</b>',
    });
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Email failed to send:');
    console.error(error);
  }
}

testMail();
