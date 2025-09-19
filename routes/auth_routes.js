const express = require("express");
const {
  signup,
  verifyOTP,
  resendOTP,
  login,
  getMe,
} = require("../controllers/auth_controller");
const {
  validateSignup,
  validateLogin,
  validateOTP,
} = require("../middleware/validation_middleware");
const { protect } = require("../middleware/auth_middleware");

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/verify-otp", validateOTP, verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", validateLogin, login);
router.get("/me", protect, getMe);

module.exports = router;
