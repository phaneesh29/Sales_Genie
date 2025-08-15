import nodemailer from "nodemailer";
import { APPLICATION_NAME } from "../constants.js";

export const mailer = async ({ to, subject, text }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: `${APPLICATION_NAME}<${process.env.SMTP_USER}>`,
            to,
            subject,
            html:text,
        });
    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
        throw error;
    }
}