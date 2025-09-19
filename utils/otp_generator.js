const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};

module.exports = {
  generateOTP,
  isOTPExpired,
};
