// controllers/profileController.js
const bcrypt = require("bcryptjs");
const User = require("../model/user_model");

const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user not found in request",
      });
    }

    // req.user already contains user from middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dob: user.dob || null,
        address: user.address || "",
      },
    });
  } catch (error) {
    console.error("Get profile error:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, dob, address } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update only allowed fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phone = phone || user.phone;
    user.dob = dob || user.dob;
    user.address = address || user.address;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        dob: user.dob,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
