import { Resend } from "resend";
import { ENV } from "../config/env.config.js";

// Initialize Resend with your API key
const resend = new Resend(ENV.RESEND_API_KEY);
const fromEmail = "Shopflow <onboarding@resend.dev>"; // Resend's required default "from" address for the free tier

/**
 * Master function to send any email using Resend
 */
const sendEmail = async ({ email, subject, htmlContent }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [email], // Must be an array
            subject: subject,
            html: htmlContent,
        });

        if (error) {
            console.error(`[MAIL ERROR] Resend failed for ${email}:`, error);
            return false;
        }

        console.log(
            `[MAIL] Email sent successfully to ${email}. ID: ${data.id}`
        );
        return true;
    } catch (error) {
        console.error(
            `[MAIL CRITICAL ERROR] Failed to send email to ${email}:`,
            error
        );
        return false;
    }
};

// --- Your existing email functions (No logic changes needed) ---

export const sendVerificationEmail = async (email, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Verify Your Email for Shopflow</h2>
            <p>Your verification code is:</p>
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            <p>This code expires in 1 hour.</p>
        </div>
    `;
    return await sendEmail({
        email,
        subject: `Verify your Shopflow Email`,
        htmlContent: html,
    });
};

export const sendWelcomeEmail = async (email, name) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to Shopflow, ${name}! 🎉</h2>
            <p>We're excited to have you on board. You can now start shopping for the best products.</p>
            <a href="${ENV.FRONTEND_URL}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Shopping</a>
        </div>
    `;
    return await sendEmail({
        email,
        subject: "Welcome to Shopflow!",
        htmlContent: html,
    });
};

export const sendPasswordResetEmail = async (email, otp) => {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #d9534f;">Reset Your Shopflow Password</h2>
            <p>Use the code below to reset your password:</p>
            <h1 style="color: #d9534f; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            <p>This code expires in 20 minutes.</p>
        </div>
    `;
    return await sendEmail({
        email,
        subject: `Reset Your Shopflow Password`,
        htmlContent: html,
    });
};

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
        subject: "Your Shopflow Password Was Changed",
        htmlContent: html,
    });
};
