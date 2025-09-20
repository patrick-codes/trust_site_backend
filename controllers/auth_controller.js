const User = require("../model/user_model");
const jwt = require("jsonwebtoken");
const { generateOTP, isOTPExpired } = require("../utils/otp_generator");
const { sendOTPEmail } = require("../utils/email_otp_service");
const { sendSmsHelper } = require("../utils/sms_otp_service");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Signup user
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone number",
      });
    } else {
      // Generate OTP
      const otpCode = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        otp: {
          code: otpCode,
          expiresAt: otpExpires,
        },
      });

      // Send OTP via email and SMS
      try {
        await sendOTPEmail(user.email, otpCode, user.firstName);
        // let phone = user.phone;
        // if (phone.startsWith("0")) {
        //   phone = "233" + phone.slice(1);
        // }
        // await sendSmsHelper({
        //   to: phone,
        //   otpCode: `Your TrustSphere verification code is: ${otpCode}. This code will expire in 10 minutes.`,
        // });
      } catch (error) {
        // If sending fails, delete the user
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({
          success: false,
          message: "Failed to send verification code",
        });
      }

      res.status(201).json({
        success: true,
        message:
          "User registered successfully. Please verify your account with the OTP sent to your email and phone.",
        data: {
          userId: user._id,
          email: user.email,
          otp: user.otp.code,
        },
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otp.code) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    if (isOTPExpired(user.otp.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (user.otp.code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Update user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during OTP verification",
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.otp = {
      code: otpCode,
      expiresAt: otpExpires,
    };
    await user.save();

    // Send OTP via email and SMS
    try {
      await sendOTPEmail(user.email, otpCode, user.firstName);
      await sendOTPSMS(user.phone, otpCode);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code",
      });
    }

    res.status(200).json({
      success: true,
      message: "New verification code sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while resending OTP",
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your account before logging in",
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  signup,
  verifyOTP,
  resendOTP,
  login,
  getMe,
};
