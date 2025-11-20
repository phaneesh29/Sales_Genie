import nodemailer from "nodemailer";
import { APPLICATION_NAME, SMTP_HOST, SMTP_PORT } from "../constants.js";

export const mailer = async ({ to, subject, text }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
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