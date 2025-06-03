import nodemailer, { type Transporter } from "nodemailer"
import { logger } from "../utils/logger"

class MailService {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "user@example.com",
        pass: process.env.SMTP_PASS || "password",
      },
    })
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    try {
      const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email/${token}`
      const mailOptions = {
        from: process.env.SMTP_FROM || "no-reply@admissionjockey.com",
        to,
        subject: "Verify your email - Admission Jockey",
        text: `Please verify your email by clicking the following link: ${url}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Admission Jockey!</h2>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${url}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
        `,
      }

      await this.transporter.sendMail(mailOptions)
      logger.info("Verification email sent successfully", { to })
    } catch (error) {
      logger.error("Failed to send verification email:", { to, error })
      throw error
    }
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    try {
      const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${token}`
      const mailOptions = {
        from: process.env.SMTP_FROM || "no-reply@admissionjockey.com",
        to,
        subject: "Reset your password - Admission Jockey",
        text: `You can reset your password by clicking the following link: ${url}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Click the button below to proceed:</p>
            <a href="${url}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${url}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
        `,
      }

      await this.transporter.sendMail(mailOptions)
      logger.info("Password reset email sent successfully", { to })
    } catch (error) {
      logger.error("Failed to send password reset email:", { to, error })
      throw error
    }
  }
}

export const mailService = new MailService()
