// sendSmsHelper.js
require("dotenv").config();

const axios = require("axios");

const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;

const authHeader =
  "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

async function sendSmsHelper({ to, from = "", otpCode }) {
  const url = process.env.SMS_API_URL;

  const body = {
    to,
    from: "TrustSphere",
    otpCode,
    clientId,
    clientSecret,
  };

  const response = await axios.post(url, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
  });

  return response.data;
}

module.exports = { sendSmsHelper };
