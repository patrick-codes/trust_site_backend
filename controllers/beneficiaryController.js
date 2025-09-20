const Beneficiary = require("../model/beneficiary_model");

exports.addBeneficiary = async (req, res) => {
  try {
    const { name, accountNumber, routingNumber, bank } = req.body;
    const newBeneficiary = new Beneficiary({
      name,
      accountNumber,
      routingNumber,
      bank,
    });

    await newBeneficiary.save();
    res.status(201).json(newBeneficiary);
  } catch (err) {
    res.status(500).json({ error: "Failed to add beneficiary" });
  }
};

exports.getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find().sort({ createdAt: -1 });
    res.json(beneficiaries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch beneficiaries" });
  }
};

// 🔍 Get Single Beneficiary
exports.getBeneficiaryById = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id);
    if (!beneficiary)
      return res.status(404).json({ error: "Beneficiary not found" });
    res.json(beneficiary);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch beneficiary" });
  }
};

// ❌ Delete Beneficiary
exports.deleteBeneficiary = async (req, res) => {
  try {
    await Beneficiary.findByIdAndDelete(req.params.id);
    res.json({ message: "Beneficiary deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete beneficiary" });
  }
};
