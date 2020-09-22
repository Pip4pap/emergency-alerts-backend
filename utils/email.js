const nodemailer = require('nodemailer');

const sendForgotPasswordEmail = async (credentials) => {
  //Step1: Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'calvinkenon@gmail.com',
      pass: 'Calvin25;',
    },
  });

  //Step2: Create Email options object
  const mailOptions = {
    from: 'calvinkenon@gmail.com',
    to: 'calvin@talktosema.org',
    subject: credentials.subject,
    text: credentials.message,
  };

  //Step3: Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendForgotPasswordEmail;
