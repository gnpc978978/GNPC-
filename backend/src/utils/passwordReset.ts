import crypto from "crypto";
import nodemailer from "nodemailer";

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const RESET_TOKEN_EXPIRY_MS = 10 * 60 * 1000;

export const hashResetValue = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

export const createOtp = () => crypto.randomInt(100000, 1000000).toString();

export const createResetToken = () => crypto.randomBytes(32).toString("hex");

export const getOtpExpiry = () => new Date(Date.now() + OTP_EXPIRY_MS);

export const getResetTokenExpiry = () =>
  new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

export const normalizePhone = (value: string): string | null => {
  const normalized = value.trim().replace(/[\s()-]/g, "");

  return /^\+[1-9]\d{7,14}$/.test(normalized) ? normalized : null;
};

export const isEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const sendResetOtpEmail = async (email: string, otp: string) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM) {
    throw new Error("Email delivery is not configured");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  await transporter.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: "Your Press Club password reset code",
    text: `Your password reset code is ${otp}. It expires in 10 minutes. Do not share this code.`,
  });
};

export const sendResetOtpSms = async (phone: string, otp: string) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    throw new Error("SMS delivery is not configured");
  }

  const credentials = Buffer.from(
    `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
  ).toString("base64");
  const body = new URLSearchParams({
    To: phone,
    From: TWILIO_FROM_NUMBER,
    Body: `Your Press Club password reset code is ${otp}. It expires in 10 minutes.`,
  });
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  if (!response.ok) {
    throw new Error("SMS delivery failed");
  }
};
