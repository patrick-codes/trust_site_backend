const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    accountNumber: { type: String, required: true },
    routingNumber: String,
    bank: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Beneficiary", beneficiarySchema);
