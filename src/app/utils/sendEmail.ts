import nodemailer from 'nodemailer';
import config from '../config';

const sendEmail = async(emailTo: string, resetLink:string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.Node_Env === "production", // true for port 465, false for other ports
        auth: {
          user: config.smtp_username,
          pass: config.smtp_password,
        },
      });

 
      const htmlBody = `
      <h2>Reset Password</h2>
      <p>To reset your password, click the button below:</p>
      <a href="${resetLink}" style="
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 5px;
      ">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
  `;
    


      // send mail with defined transport object
  await transporter.sendMail({
    from: `Health Care ${config.smtp_from}`, //sender email address//smtp-username
    to: emailTo, // list of receivers
    subject: "Reset Your Password within 10 minutes", // Subject line
    //text: resetLink, // plain text body
    html: htmlBody // html body
  });
      

}

export default sendEmail;