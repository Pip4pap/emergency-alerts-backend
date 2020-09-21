const nodemailer = require('nodemailer');

const sendForgotPasswordEmail = async (credentials) => {
  //Step1: Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'calvinkenon@gmail.com',
      pass: 'Calvin25;',
    },
  });

  //Step2: Create Email options object
  const mailOptions = {
    from: 'calvinkenon@gmail.com',
    to: 'phillip.musumba.52@gmail.com ',
    subject: credentials.subject,
    text: credentials.message,
  };

  //Step3: Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendForgotPasswordEmail;
