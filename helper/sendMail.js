const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, html) =>{

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Email của bạn
      pass: process.env.EMAIL_PASS //MK 
    }
  });
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: html
  };
  
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('Lỗi gửi mail:', error);
    } else {
      console.log('Email đã gửi: ' + info.response);
    }
  });
}