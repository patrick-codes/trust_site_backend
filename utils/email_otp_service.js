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
    // Send OTP via Email
    await transporter.sendMail({
      from: `"TRUSTSPHERE LTD." <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Verification Code`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a56db;">TrustSphere</h2>
          <p>Dear ${firstName},</p>
          <p>Your verification code for TrustSphere is:</p>
          <h1 style="background: #f3f4f6; padding: 15px; text-align: center; letter-spacing: 5px; font-size: 24px;">
            ${otpCode}
          </h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <br>
          <p>Best regards,<br>TrustSphere Team</p>
        </div>`,
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Export function in CommonJS style
module.exports = { sendOTPEmail };
