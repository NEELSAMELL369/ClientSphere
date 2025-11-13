import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, text, html }) => {
  // ✅ Skip sending email in test environment
  if (process.env.NODE_ENV === "test") {
    console.log("📧 Email skipped in test environment");
    return "Email sent (mock)";
  }

  try {
    const info = await transporter.sendMail({
      from: `"MyApp" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email error:", err.message);
    throw new Error("Email could not be sent");
  }
};
