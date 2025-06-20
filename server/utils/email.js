// // utils/email.js
// const nodemailer = require('nodemailer');

// const sendEmail = async options => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//   };

//   console.log('Sending email with options:', mailOptions);

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    html: options.message // Changed from 'text' to 'html'
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
