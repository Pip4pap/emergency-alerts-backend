const nodemailer = require('nodemailer');

const sendForgotPasswordEmail = async (credentials) => {
  //Step1: Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'c146a9fa6db2bf',
      pass: '288e6e26a002ca',
    },
  });

  //Step2: Create Email options object
  const mailOptions = {
    from: 'emergencyalerts@gmail.com',
    to: credentials.email,
    subject: credentials.subject,
    text: credentials.message,
  };

  //Step3: Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendForgotPasswordEmail;
