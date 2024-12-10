"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (emailTo, resetLink) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config_1.default.Node_Env === "production", // true for port 465, false for other ports
        auth: {
            user: config_1.default.smtp_username,
            pass: config_1.default.smtp_password,
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
    yield transporter.sendMail({
        from: `Health Care ${config_1.default.smtp_from}`, //sender email address//smtp-username
        to: emailTo, // list of receivers
        subject: "Reset Your Password within 10 minutes", // Subject line
        //text: resetLink, // plain text body
        html: htmlBody // html body
    });
});
exports.default = sendEmail;
