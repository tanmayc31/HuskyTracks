import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/send-match-email", async (req, res) => {
  const { to, itemTitle, locationName } = req.body;

  const mailOptions = {
    from: `"HuskyTracks Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Lost Item Match Found at ${locationName}`,
    html: `
      <p>Hi there,</p>
      <p>We believe we found your lost item: <strong>${itemTitle}</strong> at <strong>${locationName}</strong>.</p>
      <p>Please visit the location to verify and collect it.</p>
      <br />
      <p>– HuskyTracks Support Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    res.status(500).json({ message: "Email sending failed", error });
  }
});

export default router;
