import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendEmail = async ({ to, subject, html }: EmailOptions): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })

    console.log('✓ Email sent:', info.messageId)
  } catch (error) {
    console.error('✗ Email error:', error)
    throw new Error('Failed to send email')
  }
}

// Verify transporter configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    await transporter.verify()
    console.log('✓ Email server is ready')
    return true
  } catch (error) {
    console.error('✗ Email server error:', error)
    return false
  }
}
