import nodemailer from "nodemailer";
import { ENV } from "../config/env.config.js";

// Initialize the Transporter (The Engine)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER, // Your Gmail
        pass: process.env.MAIL_PASS, // Your App Password
    },
});

/**
 * Master function to send any email
 */
const sendEmail = async ({ email, subject, htmlContent }) => {
    try {
        const mailOptions = {
            from: `"Shopflow Team" <${process.env.MAIL_USER}>`, // Sender address
            to: email, // Receiver address
            subject: subject,
            html: htmlContent, // HTML body
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[MAIL] Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`[MAIL ERROR] Failed to send email:`, error.message);
        return false;
    }
};

/**
 * 1. Email Verification (OTP)
 */
export const sendVerificationEmail = async (email, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Verify Your Email</h2>
            <p>Welcome to Shopflow! Your verification code is:</p>
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            <p>This code expires in 1 hour.</p>
        </div>
    `;

    return await sendEmail({
        email,
        subject: "Verify Your Shopflow Email",
        htmlContent: html,
    });
};

/**
 * 2. Welcome Email
 */
export const sendWelcomeEmail = async (email, name) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to Shopflow, ${name}! 🎉</h2>
            <p>We are excited to have you on board.</p>
            <p>You can now log in and start shopping.</p>
            <a href="${ENV.FRONTEND_URL}/login" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
        </div>
    `;

    return await sendEmail({
        email,
        subject: "Welcome to Shopflow!",
        htmlContent: html,
    });
};

/**
 * 3. Forgot Password (OTP)
 */
export const sendPasswordResetEmail = async (email, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #d9534f;">Reset Your Password</h2>
            <p>Use the code below to reset your password:</p>
            <h1 style="color: #d9534f; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            <p>This code expires in 20 minutes.</p>
        </div>
    `;

    return await sendEmail({
        email,
        subject: "Reset Your Shopflow Password",
        htmlContent: html,
    });
};

/**
 * 4. Password Changed Notification
 */
export const sendPasswordChangedNotification = async (email) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Security Alert 🔒</h2>
            <p>Your Shopflow password was just changed.</p>
            <p>If you did not do this, please contact support immediately.</p>
        </div>
    `;

    return await sendEmail({
        email,
        subject: "Your Password Was Changed",
        htmlContent: html,
    });
};
