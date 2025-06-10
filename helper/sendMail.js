const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, html) =>{

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_SENDER, // Email của bạn
      clientId: process.env.CLIENT_ID,
      clientSecret:  process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    }
  });
  
  const mailOptions = {
    from: 'vansi150905@gmail.com',
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