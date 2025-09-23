require("dotenv").config();
const nodemailer = require("nodemailer");
const user = require("../model/user_model");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otpCode, firstName) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

    await transporter.sendMail({
      from: `"SmartLuca Trust" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Verification Code`,
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <img src="https://smartlucatrust.com/assets/logo_2.png" alt="Logo" style="width: 150px; margin-bottom: 20px;">
      <p>Dear ${firstName},</p>
      <p>Your verification code for SmartLuca Trust is:</p>
      <h1 style="background: #f3f4f6; padding: 15px; text-align: center; letter-spacing: 5px; font-size: 24px;">
        ${otpCode}
      </h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <br>
      <p>Best regards,<br>SmartLuca Trust Team</p>
    </div>
  `,
    });

    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Export function in CommonJS style
module.exports = { sendOTPEmail };
