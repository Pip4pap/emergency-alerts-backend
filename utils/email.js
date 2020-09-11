const nodemailer = require('nodemailer');

const sendForgotPasswordEmail = async (credentials) => {
  //Step1: Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //Step2: Create Email options object
  const mailOptions = {
    from: 'calvinkaregyeya@gmail.com',
    to: credentials.email,
    subject: credentials.subject,
    text: credentials.message,
  };

  //Step3: Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendForgotPasswordEmail;
