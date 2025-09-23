const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth_middleware");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

router.get("/test", (req, res) => {
  res.json({ success: true, message: "Profile route working!" });
});

// GET profile
router.get("/", protect, getProfile);

// UPDATE profile
router.put("/", protect, updateProfile);

module.exports = router;
