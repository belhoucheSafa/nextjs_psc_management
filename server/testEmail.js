const nodemailer = require('nodemailer');
require('dotenv').config({ path: './config.env' });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const mailOptions = {
  from: process.env.EMAIL_FROM,
  to: 'belhouchesafa@gmail.com', // change to your actual test email
  subject: 'Test Email',
  text: 'Hello! This is a test email.'
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.error('Email sending failed:', err);
  } else {
    console.log('Email sent:', info.response);
  }
});
