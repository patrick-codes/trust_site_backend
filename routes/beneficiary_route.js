const express = require("express");
const router = express.Router();
const {
  addBeneficiary,
  getBeneficiaries,
  getBeneficiaryById,
  deleteBeneficiary,
} = require("../controllers/beneficiaryController");

// ➕ Add
router.post("/", addBeneficiary);

// 📋 Get all
router.get("/", getBeneficiaries);

// 🔍 Get single
router.get("/:id", getBeneficiaryById);

// ❌ Delete
router.delete("/:id", deleteBeneficiary);

module.exports = router;
